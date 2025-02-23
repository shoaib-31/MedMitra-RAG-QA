from fastapi import APIRouter, HTTPException
from backend.core.database import chat_collection 

router = APIRouter()

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Fetch past conversations for a given session."""
    try:
        # Retrieve chat session based on session_id
        chat_session = await chat_collection.find_one({"session_id": session_id})

        if not chat_session:
            raise HTTPException(status_code=404, detail="No chat history found for this session.")

        return {
            "session_id": chat_session["session_id"],
            "title": chat_session["title"],
            "messages": chat_session["messages"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")
