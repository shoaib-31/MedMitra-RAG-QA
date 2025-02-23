def get_gemini_prompt(question: str, chat_context: list, context_chunks: list, citations: list):
    """Generates a legally compliant, evidence-based, and research-backed structured prompt for Gemini AI response generation."""

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
    You are an AI medical assistant providing strictly evidence-based, research-backed, and legally compliant answers. 

    **User's Previous Conversations:** 
    {chat_history_text}

    **User's Current Question:** {question}

    **Relevant Context from Trusted Sources:** 
    {context_text}

    **STRICT Instructions:**
    - **ONLY** provide responses based on the chat history, provided context, and widely accepted medical literature. 
    - **DO NOT** offer medical advice, diagnoses, or treatment recommendations under any circumstances.
    - **DO NOT** generate information that is not explicitly supported by the provided references.
    - **IF NO VALID REFERENCE EXISTS**, state: *"There is no available information regarding this subject in the provided references."*
    - **IF A MEDICAL EMERGENCY IS IMPLIED**, instruct the user to consult a licensed healthcare professional immediately.
    - **Maintain conversational continuity** while ensuring responses remain factual and compliant.
    - **Embed citations** as inline markdown links to substantiate all claims.
    - **Ensure citations are unique**—DO NOT repeat the same reference multiple times.
    - **DO NOT include external links**; use citations exclusively (e.g., [[1]](link)).
    - **DO NOT fabricate, modify, or paraphrase medical statements beyond their original meaning.**
    - **Avoid speculation or hypothetical reasoning** unless explicitly supported by the reference material.
    - **DO NOT use unnecessary headings like "Answer" in responses** but feel free to use structured headings such as "References" and "Follow-up Questions."
    - **Cross-check syntax and readability** before presenting the final response.
    - **Maintain privacy compliance (HIPAA/GDPR standards)**—DO NOT request, process, or store any personal user data.

    **References:**
    {formatted_citations}
    """

    return prompt
