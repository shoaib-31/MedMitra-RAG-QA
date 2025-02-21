from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from pinecone import Pinecone
from fastembed import TextEmbedding
import os
import PyPDF2
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI()

# Load environment variables
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

@app.post("/ask")
def ask_question(query: Query):
    return {"answer": f"Here's a dummy answer to your question: '{query.question}'"}

@app.post("/ingest")
async def ingest_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # Initialize Pinecone client
        pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Initialize FastEmbed model
        embedding_model = TextEmbedding()
        
        # Read PDF content
        pdf_reader = PyPDF2.PdfReader(file.file)
        text_content = ""
        for page in pdf_reader.pages:
            text_content += page.extract_text()
        
        # Generate embeddings
        embeddings = list(embedding_model.embed([text_content]))
        
        # Insert into Pinecone
        index = pc.Index(PINECONE_INDEX_NAME)
        index.upsert(vectors=[(file.filename, embeddings[0], {"source": file.filename})])
        
        return {"message": f"PDF '{file.filename}' ingested and embeddings stored in Pinecone"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
