from fastapi import APIRouter, HTTPException, Depends
from backend.services.retrieval import retrieve_relevant_chunks
from backend.services.generation import generate_response_with_gemini
from backend.core.database import chat_collection
from pydantic import BaseModel, Field
from typing import Optional, List
import uuid
import datetime

router = APIRouter()

class QueryRequest(BaseModel):
    """Request model for querying AI assistant."""
    session_id: Optional[str] = Field(None, description="Unique session identifier for conversation memory")
    question: str = Field(..., min_length=5, max_length=500, description="User's question")
    top_k: int = Field(5, ge=1, le=10, description="Number of top results to retrieve")


@router.post("/ask")
async def ask_question(query_request: QueryRequest):
    """Handles user queries by retrieving past context and generating an AI response."""
    try:
        # If no session_id is provided, generate a new one
        session_id = query_request.session_id or str(uuid.uuid4())

        # Fetch previous chat history from MongoDB
        previous_chats_cursor = chat_collection.find({"session_id": session_id}).sort("timestamp", -1).limit(5)
        previous_chats = await previous_chats_cursor.to_list(length=5)

        # Format chat history (include timestamps and role)
        chat_context = [
            {"role": chat["role"], "text": chat["text"], "timestamp": chat["timestamp"]}
            for chat in previous_chats
        ]

        # Retrieve relevant external knowledge (RAG)
        retrieved_info, citations = retrieve_relevant_chunks(query_request.question, query_request.top_k)

        # Generate AI response
        answer, follow_up_questions = generate_response_with_gemini(
            query_request.question, chat_context, retrieved_info, citations
        )

        # Store user's query in MongoDB
        user_chat_entry = {
            "session_id": session_id,
            "role": "user",
            "text": query_request.question,
            "timestamp": datetime.datetime.utcnow()
        }
        await chat_collection.insert_one(user_chat_entry)

        # Store bot's response in MongoDB
        bot_chat_entry = {
            "session_id": session_id,
            "role": "bot",
            "text": answer,
            "references": citations,
            "timestamp": datetime.datetime.utcnow()
        }
        await chat_collection.insert_one(bot_chat_entry)

        return {
            "session_id": session_id,
            "question": query_request.question,
            "answer": answer,
            "references": citations,
            "follow_up_questions": follow_up_questions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
