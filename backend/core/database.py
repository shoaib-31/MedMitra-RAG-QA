from motor.motor_asyncio import AsyncIOMotorClient
from backend.core.config import settings

# MongoDB connection URL
MONGO_URI = settings.MONGO_URI  # Update with your Docker credentials

# Initialize MongoDB Client
client = AsyncIOMotorClient(MONGO_URI)

# Connect to the chatbot database
db = client.chatbot_db  # You can change the database name
chat_collection = db.chat_sessions  # Collection to store chat data
