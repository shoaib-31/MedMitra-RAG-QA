import logging
from fastapi import HTTPException
import google.generativeai as genai
import os
from backend.prompts.templates import get_gemini_prompt
from backend.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

gemini_model = genai.GenerativeModel("gemini-pro")


def generate_response_with_gemini(question: str, chat_context: list, retrieved_info: list, citations: list):
    """Generate an AI response using Gemini based on retrieved context."""
    try:
        prompt = get_gemini_prompt(question,chat_context, retrieved_info, citations)
        response = gemini_model.generate_content(prompt)

        if response:
            response_text = response.text

            answer = response_text.strip()
            follow_up_questions = []
            return answer, follow_up_questions

        else:
            return "I'm sorry, I couldn't generate an answer at the moment.", []

    except Exception as e:
        logging.error(f"Error generating response with Gemini: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating response")

async def generate_chat_title(question: str) -> str:
    """Generates a title for the chat session based on the first user question using Gemini."""
    try:
        prompt = f"Generate a short, relevant, and concise chat title (under 4 words) for the following user question: '{question}'."

        # Use Gemini model to generate title
        response = gemini_model.generate_content(prompt)

        if response and response.text:
            title = response.text.strip().split("\n")[0]  # Take only the first line if multiple suggestions
            return title[:50]  # Limit title to 50 characters

        return "Untitled Chat"  # Default if no valid response

    except Exception as e:
        logging.error(f"Error generating chat title with Gemini: {str(e)}")
        return "Untitled Chat"
