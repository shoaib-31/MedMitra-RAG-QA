import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings 

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Configuration settings for the application."""

    # Pinecone settings
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME")

    # Gemini AI settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    
    if not PINECONE_API_KEY or not PINECONE_INDEX_NAME or not GEMINI_API_KEY:
        raise ValueError("Pinecone and Gemini API keys must be provided in the environment.")

    # General app settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    class Config:
        """Meta configuration for Pydantic settings."""
        env_file = ".env"  # Load variables from .env

# Instantiate settings
settings = Settings()
