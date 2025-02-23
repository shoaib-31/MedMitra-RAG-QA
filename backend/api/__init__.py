from fastapi import APIRouter
from .ask import router as ask_router
from .ingest import router as ingest_router

api_router = APIRouter()

api_router.include_router(ask_router, tags=["Question Answering"])
api_router.include_router(ingest_router, tags=["PDF Ingestion"])
