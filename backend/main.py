from fastapi import FastAPI
from backend.api import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Medical Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Medical Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router)