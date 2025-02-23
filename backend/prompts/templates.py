def get_gemini_prompt(question: str, chat_context: list, context_chunks: list, citations: list):
    """Generates the structured prompt for Gemini AI response generation with chat memory."""

    # Format chat history with timestamps and roles
    chat_history_text = "\n".join(
        [f"[{chat['timestamp'].isoformat()}] {chat['role'].capitalize()}: {chat['message']}" for chat in chat_context]
    ) if chat_context else "No prior context available."

    # Use top 5 retrieved chunks for external knowledge
    context_text = "\n\n".join(context_chunks[:5]) if context_chunks else "No external knowledge retrieved."

    # Format citations as inline markdown references
    formatted_citations = "\n".join(
        [f"- [{metadata.split(' by ')[0].strip()}]({metadata.split('[Source](')[-1].strip(')')})" for metadata in citations]
    ) if citations else "No references available."

    prompt = f"""
    You are an AI medical assistant providing evidence-based, research-backed answers.

    **User's Previous Conversations:** 
    {chat_history_text}

    **User's Current Question:** {question}

    **Relevant Context from Trusted Sources:** 
    {context_text}

    **Instructions:**
    - Provide a concise and informative answer to the user's question based on chat history, provided context, and widely accepted medical knowledge.
    - Use prior user interactions to maintain conversational continuity.
    - Do NOT provide official medical advice; this is for informational purposes only.
    - Embed citations as inline markdown links.
    - After the answer, suggest 2-3 related follow-up questions.
    - Recheck the answer for markdown syntax and readability.
    - Do NOT include links in the answer; use citations instead like [[1]](link).
    - Do NOT give unnecessary headings like "Answer" when responding but feel free to give headings like References and Follow-up Questions.
    - Provide a list of references at the end if citations are used.

    **References:**
    {formatted_citations}
    """

    return prompt
