from fastapi import APIRouter, HTTPException, Depends
from backend.services.retrieval import retrieve_relevant_chunks
from backend.services.generation import generate_response_with_gemini, generate_chat_title
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
        # If no session_id is provided, it's a new conversation
        if not query_request.session_id:
            session_id = str(uuid.uuid4())
            
            # Generate a title for the new session based on the first question
            chat_title = await generate_chat_title(query_request.question)

            # Create a new chat session document
            chat_session = {
                "title": chat_title,
                "session_id": session_id,
                "messages": []  # List to store message history
            }
            
            # Store session in MongoDB
            await chat_collection.insert_one(chat_session)
        else:
            # Use provided session_id
            session_id = query_request.session_id

            # Fetch existing session
            existing_session = await chat_collection.find_one({"session_id": session_id})
            if not existing_session:
                raise HTTPException(status_code=404, detail="Session not found")

        # Retrieve previous chat history from MongoDB
        previous_chats = existing_session["messages"] if query_request.session_id else []

        # Format chat history for context
        chat_context = [{"role": msg["role"], "message": msg["message"], "timestamp": msg["timestamp"]} for msg in previous_chats]

        # Retrieve relevant external knowledge (RAG)
        retrieved_info, citations = retrieve_relevant_chunks(query_request.question, query_request.top_k)

        # Generate AI response
        answer, follow_up_questions = generate_response_with_gemini(
            query_request.question, chat_context, retrieved_info, citations
        )

        # Create chat entries
        user_message = {
            "role": "user",
            "message": query_request.question,
            "timestamp": datetime.datetime.now()
        }
        bot_message = {
            "role": "bot",
            "message": answer,
            "references": citations,
            "timestamp": datetime.datetime.now()
        }

        # Update session messages
        await chat_collection.update_one(
            {"session_id": session_id},
            {"$push": {"messages": {"$each": [user_message, bot_message]}}}
        )

        return {
            "session_id": session_id,
            "title": existing_session["title"] if query_request.session_id else chat_title,
            "question": query_request.question,
            "answer": answer,
            "references": citations,
            "follow_up_questions": follow_up_questions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
