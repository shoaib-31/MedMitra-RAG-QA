from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from routes import ingest
from routes import ask

load_dotenv()

app = FastAPI()

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.environ.get("PINECONE_INDEX_NAME")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY is not set")
if not PINECONE_INDEX_NAME:
    raise ValueError("PINECONE_INDEX_NAME is not set")

class Query(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the MedMitra-RAG-QA API!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(ingest.router)
app.include_router(ask.router)
