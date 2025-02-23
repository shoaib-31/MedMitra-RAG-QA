from fastapi import APIRouter, HTTPException
from backend.services.retrieval import retrieve_relevant_chunks
from backend.services.generation import generate_response_with_gemini
from pydantic import BaseModel, Field

router = APIRouter()

class QueryRequest(BaseModel):
    """Request model for querying AI assistant."""
    question: str = Field(..., min_length=5, max_length=500, description="User's question")
    top_k: int = Field(5, ge=1, le=10, description="Number of top results to retrieve")


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
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
