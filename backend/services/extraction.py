from typing import List
import PyPDF2
from fastapi import HTTPException


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