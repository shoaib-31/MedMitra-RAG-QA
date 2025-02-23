from fastapi import APIRouter, HTTPException
from backend.core.database import chat_collection

router = APIRouter()

@router.get("/session-history")
async def get_session_history():
    """Retrieves a list of all chat sessions with their session ID, last message timestamp, and title."""
    try:
        # Fetch all chat sessions from the database
        chat_sessions = await chat_collection.find({}, {"session_id": 1, "messages": 1, "title": 1}).to_list(None)

        # Format the response
        chat_history = []
        for session in chat_sessions:
            last_message = session["messages"][-1] if session["messages"] else None
            last_timestamp = last_message["timestamp"] if last_message else None
            
            chat_history.append({
                "id": session["session_id"],
                "title": session["title"],
                "date": last_timestamp
            })

        return chat_history
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving chat history: {str(e)}")