from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from routers import users
from config.database import init_db
from feedback.feedback_processor import FeedbackProcessor
import logging
import os
from audioProcessor import process_audio_file
from typing import Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FeedbackProcessor
feedback_processor = FeedbackProcessor()

# # Add startup event handler
# @app.on_event("startup")
# async def startup_event():
#     await init_db()

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your new project!"}

@app.post("/process-audio") 
async def process_audio(file: UploadFile = File(...)):
    try:
        # Create a temporary directory if it doesn't exist
        temp_dir = "temp_audio"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the uploaded file temporarily
        temp_file_path = os.path.join(temp_dir, file.filename)
        with open(temp_file_path, "wb") as buffer:
            contents = await file.read()
            buffer.write(contents)
        
        # Process the audio file
        result = await process_audio_file(temp_file_path)
        print(result)
        
        # Clean up the temporary file
        os.remove(temp_file_path)
        
        # Return the processing result
        return result
        
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.post("/analyze-text")
async def analyze_text(text_data: Dict = Body(...)):
    try:
        text = text_data.get("text", "")
        if not text:
            return {"error": "No text provided"}
            
        # Process the text using our feedback processor
        feedback = await feedback_processor.analyze_text(text)
        return feedback
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return {"status": "error", "message": str(e)}

app.include_router(users.router, prefix="/api/users", tags=["users"])