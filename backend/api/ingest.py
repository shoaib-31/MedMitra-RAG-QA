from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import os
from fastembed import TextEmbedding
from pinecone import Pinecone
from backend.core.config import settings
from backend.services.extraction import extract_text_from_pdf, chunk_text

router = APIRouter()

embedding_model = TextEmbedding()


pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

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
