from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import os
import PyPDF2
from fastembed import TextEmbedding
from pinecone import Pinecone
from typing import List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

if not PINECONE_API_KEY or not PINECONE_INDEX_NAME:
    raise ValueError("PINECONE_API_KEY or PINECONE_INDEX_NAME is not set")

embedding_model = TextEmbedding()

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

def extract_text_from_pdf(pdf_file) -> str:
    """Extracts text from a PDF file efficiently."""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text_content = []

    for page in pdf_reader.pages:
        extracted_text = page.extract_text()
        if extracted_text:
            text_content.append(extracted_text)

    if not text_content:
        raise HTTPException(status_code=400, detail="Failed to extract text from the PDF.")

    return "\n".join(text_content)

def chunk_text(text: str, max_tokens: int = 300) -> List[str]:
    """Splits text into manageable chunks (~300 tokens)."""
    words = text.split()
    return [" ".join(words[i : i + max_tokens]) for i in range(0, len(words), max_tokens)]

@router.post("/ingest")
async def ingest_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    author: str = Form(...),
    link: str = Form(...)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    try:
        # Extract and chunk text
        text_content = extract_text_from_pdf(file.file)
        chunks = chunk_text(text_content, max_tokens=300)

        # Generate embeddings with FastEmbed
        embeddings = list(embedding_model.embed(chunks))

        # Insert embeddings into Pinecone with metadata
        vectors = [
            (
                f"{file.filename}_{i+1}",  # Unique ID
                embeddings[i],  # Embedding vector
                {  # Metadata for citation
                    "source": file.filename,
                    "title": title,
                    "author": author,
                    "link": link,
                    "chunk_id": i+1,
                    "content": chunk
                }
            )
            for i, chunk in enumerate(chunks)
        ]

        index.upsert(vectors=vectors)

        return {
            "message": f"PDF '{file.filename}' ingested successfully with title '{title}', author '{author}', and link '{link}'."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
