from fastapi import APIRouter, HTTPException
from backend.core.database import chat_collection 

router = APIRouter()

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Fetch past conversations for a given session."""
    try:
        chats_cursor = chat_collection.find({"session_id": session_id}).sort("timestamp", 1)
        chats = await chats_cursor.to_list(length=50)

        if not chats:
            raise HTTPException(status_code=404, detail="No chat history found for this session.")

        return [
            {
                "role": chat["role"],  # "user" or "bot"
                "text": chat["text"],
                "timestamp": chat["timestamp"]
            }
            for chat in chats
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {str(e)}")
