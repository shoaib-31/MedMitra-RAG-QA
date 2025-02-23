from fastapi import FastAPI
from backend.api import api_router

app = FastAPI(title="AI Medical Assistant API")

app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Medical Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(api_router)