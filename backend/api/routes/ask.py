from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Pinecone
from pinecone import Pinecone
import google.generativeai as genai
import logging

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not PINECONE_API_KEY or not PINECONE_INDEX_NAME or not GEMINI_API_KEY:
    raise ValueError("Missing API keys: Ensure Pinecone and Gemini API keys are set in .env")

router = APIRouter()

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")

logging.basicConfig(level=logging.INFO)


class QueryRequest(BaseModel):
    """Request model with data validation."""
    question: str = Field(..., min_length=5, max_length=500, description="User's question")
    top_k: int = Field(5, ge=1, le=10, description="Number of top results to retrieve")


def retrieve_relevant_chunks(query: str, top_k: int = 5):
    """Retrieve top-k relevant chunks from Pinecone using LangChain embeddings."""
    try:
        query_embedding = embedding_model.embed_query(query)
        search_results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)

        if not search_results or "matches" not in search_results:
            raise HTTPException(status_code=404, detail="No relevant context found.")

        retrieved_chunks = []
        citations = []

        for match in search_results["matches"]:
            metadata = match.get("metadata", {})
            retrieved_chunks.append(metadata.get("content", ""))
            citations.append(
                f"**{metadata.get('title', 'Unknown Title')}** by {metadata.get('author', 'Unknown Author')} - "
                f"[Source]({metadata.get('link', '#')})"
            )

        return retrieved_chunks, citations

    except Exception as e:
        logging.error(f"Error retrieving relevant chunks: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving data from Pinecone")


def generate_response_with_gemini(question: str, context_chunks: list, citations: list):
    """Generate an AI response using Gemini based on retrieved context."""
    try:
        context_text = "\n\n".join(context_chunks[:5])  # Use top 5 retrieved chunks
        citation_text = "\n".join(citations[:5])

        prompt = f"""
        You are an AI medical assistant providing evidence-based, research-backed answers.

        **User Question:** {question}

        **Relevant Context from Trusted Sources:** 
        {context_text}

        **Instructions:**
        - Provide a concise and informative answer to the user's question based on the provided context and widely accepted medical knowledge.
        - Do NOT provide official medical advice; this is for informational purposes only.
        - Cite sources wherever applicable.
        - After the answer, suggest 2-3 related follow-up questions that the user might find helpful.

        **References:**
        {citation_text}
        """

        response = gemini_model.generate_content(prompt)
        if response:
            response_text = response.text
            if "**Follow-up Questions:**" in response_text:
                answer, follow_up_section = response_text.split("**Follow-up Questions:**", 1)
                follow_up_questions = [q.strip() for q in follow_up_section.split('\n') if q.strip()]
            else:
                answer = response_text
                follow_up_questions = []
            return answer.strip(), follow_up_questions
        else:
            return "I'm sorry, I couldn't generate an answer at the moment.", []

    except Exception as e:
        logging.error(f"Error generating response with Gemini: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating response")


@router.post("/ask")
async def ask_question(query_request: QueryRequest):
    """Handles user queries by retrieving relevant data and generating an AI response."""
    try:
        retrieved_chunks, citations = retrieve_relevant_chunks(query_request.question, query_request.top_k)
        answer, follow_up_questions = generate_response_with_gemini(query_request.question, retrieved_chunks, citations)

        return {
            "question": query_request.question,
            "answer": answer,
            "references": citations,
            "follow_up_questions": follow_up_questions
        }

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")