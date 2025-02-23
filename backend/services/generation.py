import logging
import google.generativeai as genai
import os
from backend.prompts.templates import get_gemini_prompt
from backend.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

gemini_model = genai.GenerativeModel("gemini-pro")


def generate_response_with_gemini(question: str, context_chunks: list, citations: list):
    """Generate an AI response using Gemini based on retrieved context."""
    try:
        prompt = get_gemini_prompt(question, context_chunks, citations)
        response = gemini_model.generate_content(prompt)

        if response:
            response_text = response.text

            answer = response_text.strip()
            follow_up_questions = []

            if "**Follow-up Questions:**" in response_text:
                answer, follow_up_section = response_text.split("**Follow-up Questions:**", 1)
                follow_up_questions = [
                    q.strip().lstrip("- ") for q in follow_up_section.split("\n") if q.strip()
                ]

            markdown_answer = f"{answer.strip()}\n\n**References:**\n{citations}"

            return markdown_answer, follow_up_questions

        else:
            return "I'm sorry, I couldn't generate an answer at the moment.", []

    except Exception as e:
        logging.error(f"Error generating response with Gemini: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating response")
