from fastapi import APIRouter
from .ask import router as ask_router
from .ingest import router as ingest_router
from .history import router as history
from .session_history import router as session_history

api_router = APIRouter()

api_router.include_router(ask_router, tags=["Question Answering"])
api_router.include_router(ingest_router, tags=["PDF Ingestion"])
api_router.include_router(history, tags=["Chat History Retrieval"])
api_router.include_router(session_history, tags=["Session History Retrieval"])
