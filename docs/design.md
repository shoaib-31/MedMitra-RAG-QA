# System Design Document

## Overview

This document describes the system design choices made while building the solution within a strict time constraint of 3 days and on a low-end laptop. The goal was to create an efficient and scalable system using a combination of Next.js (frontend), FastAPI (backend), Gemini Pro (LLM), MongoDB (database), and Pinecone (vector database).

## Key Constraints

1. **Time Constraint**: The entire system had to be built in just 3 days.
2. **Hardware Limitations**: Development was done on a low-end laptop, restricting the use of resource-intensive processes.

## Design Considerations

### 1. **Technology Stack**

- **Frontend**: Next.js (for fast and efficient UI rendering)
- **Backend**: FastAPI (for lightweight and fast API development)
- **LLM**: Gemini Pro (for generating responses based on retrieved embeddings)
- **Database**: MongoDB (for storing chat history and metadata)
- **Vector Database**: Pinecone (to store and retrieve vector embeddings efficiently)
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (chosen for its balance between performance and resource efficiency)
- **PDF Processing**: PyPDF2 (to extract text from PDFs in an efficient manner)

### 2. **Data Flow and Architecture**

#### **Query Handling (Retrieval-Augmented Generation - RAG)**

1. User submits a query via the Next.js frontend.
2. FastAPI backend processes the request:
   - If it's a new chat session, a session ID is generated, and a title is assigned using Gemini Pro.
   - The session metadata is stored in MongoDB.
   - If it's an existing chat session, previous messages are retrieved from MongoDB.
   - The query is chunked and passed to `all-MiniLM-L6-v2` for embedding.
   - The embedding is compared with existing embeddings stored in Pinecone.
3. Relevant context is retrieved and sent to Gemini Pro along with the original query.
4. Gemini Pro generates a response, which is returned to the client.

#### **Document Ingestion**

1. The user uploads a document via the Next.js frontend.
2. The FastAPI backend reads the document using PyPDF2, extracts text, and chunks it.
3. The text chunks are converted into embeddings using `all-MiniLM-L6-v2`.
4. These embeddings are stored in Pinecone, along with metadata such as title and owner information.
5. The response is returned to the client upon successful ingestion.

### 3. **Optimizations for Low-End Laptop**

- **Minimal Dependencies**: Used FastAPI instead of Flask to keep the backend lightweight.
- **Efficient Embedding Model**: `all-MiniLM-L6-v2` was chosen over larger models to reduce computation requirements.
- **Batch Processing**: Query and document chunks were processed in batches to avoid overloading memory.
- **Local Development with Remote API Calls**: Pinecone, MongoDB, and Gemini Pro were used remotely to reduce local computation overhead.
- **Parallel Processing Where Possible**: Leveraged async capabilities in FastAPI for concurrent execution of API calls.

### 4. **Challenges Faced**

- **Limited RAM and CPU**: Running a large model locally was infeasible, so remote API calls were used instead.
- **Handling Large Documents**: Chunking had to be optimized to ensure that embeddings could be stored and retrieved efficiently.
- **Ensuring Low Latency**: Pre-fetching embeddings and caching responses where possible helped improve response times.

### 5. **Future Improvements**

- **Better Chunking Strategy**: Implement adaptive chunking to improve retrieval accuracy.
- **Indexing Optimization**: Explore alternative vector databases like FAISS for improved performance.
- **Multi-threaded Processing**: Utilize threading/multiprocessing where applicable to speed up API calls.
- **Frontend Enhancements**: Improve UI/UX to handle errors gracefully and provide better feedback to users.
- **Session Management Enhancements**: Improve MongoDB queries and optimize session storage for better scalability.

## Conclusion

Despite the constraints of time and hardware, the system was designed with a pragmatic approach. By leveraging lightweight frameworks, efficient embedding models, and remote processing, the system achieved its objectives within the given limitations. Future iterations can focus on optimizing performance, session management, and improving retrieval accuracy.
