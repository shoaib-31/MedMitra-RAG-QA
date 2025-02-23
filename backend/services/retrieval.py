import logging
from fastapi import HTTPException
from langchain_huggingface import HuggingFaceEmbeddings
from pinecone import Pinecone
import os
from backend.core.config import settings

pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


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
