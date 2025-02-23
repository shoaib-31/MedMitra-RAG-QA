def get_gemini_prompt(question: str, context_chunks: list, citations: list):
    """Generates the structured prompt for Gemini AI response generation."""
    context_text = "\n\n".join(context_chunks[:5])  # Use top 5 retrieved chunks

    formatted_citations = "\n".join(
        [f"- [{metadata.split(' by ')[0].strip()}]({metadata.split('[Source](')[-1].strip(')')})" for metadata in citations]
    )

    prompt = f"""
    You are an AI medical assistant providing evidence-based, research-backed answers.

    **User Question:** {question}

    **Relevant Context from Trusted Sources:** 
    {context_text}

    **Instructions:**
    - Provide a concise and informative answer to the user's question based on the provided context and widely accepted medical knowledge.
    - Do NOT provide official medical advice; this is for informational purposes only.
    - Embed citations as inline markdown links.
    - After the answer, suggest 2-3 related follow-up questions.
    - Recheck the answer for markdown syntax and readability.
    - Do NOT include links in the answer; use citations instead like [[1]](link).
    - Do NOT give unnecessary headings which are obvious like "Answer".

    **References:**
    {formatted_citations}
    """
    
    return prompt
