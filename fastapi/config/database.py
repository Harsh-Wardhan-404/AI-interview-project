from motor.motor_asyncio import AsyncIOMotorClient
# from dotenv import load_dotenv
import os
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MONGODB_URL = "mongodb+srv://vedant22211000:vedant@cluster0.tvr7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(MONGODB_URL)
db = client.fastapi_db

async def init_db():
    try:
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e