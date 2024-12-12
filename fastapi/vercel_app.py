from fastapi import FastAPI, UploadFile, File, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import users
from config.database import init_db
from feedback.feedback_processor import FeedbackProcessor
from feedback.check_correctness import check_answer_correctness
from feedback.ideal_answer import ideal_answer_generator
from setupGeneration import generate_assessment_questions
import logging
import os
from audioProcessor import process_audio_file
from typing import Dict, List
import tempfile
import shutil

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your production frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FeedbackProcessor
feedback_processor = FeedbackProcessor()

# Create temp directory in /tmp for Vercel
TEMP_DIR = "/tmp/audio"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to your FastAPI application!"}

@app.post("/process-audio")
async def process_audio(file: UploadFile = File(...)):
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, dir=TEMP_DIR, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            # Copy uploaded file to temporary file
            shutil.copyfileobj(file.file, temp_file)
            temp_file_path = temp_file.name

        logger.info(f"Saved audio file to {temp_file_path}")

        # Process the audio file
        result = await process_audio_file(temp_file_path)

        # Clean up
        try:
            os.unlink(temp_file_path)
        except Exception as e:
            logger.warning(f"Error cleaning up temp file: {e}")

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

        # Process the text using feedback processor
        feedback = await feedback_processor.analyze_text(text)
        return feedback

    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.post("/check-answer")
async def check_answer(data: Dict = Body(...)):
    try:
        question = data.get("question", "")
        answer = data.get("answer", "")

        if not question or not answer:
            raise HTTPException(
                status_code=400,
                detail="Both question and answer are required"
            )

        result = check_answer_correctness(question, answer)
        return result

    except Exception as e:
        logger.error(f"Error checking answer: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check answer: {str(e)}"
        )

@app.post("/generate-questions")
async def generate_questions(setup_data: Dict = Body(...)) -> Dict[str, List[str]]:
    try:
        questions = await generate_assessment_questions(setup_data)
        return {"questions": questions}

    except Exception as e:
        logger.error(f"Error generating questions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate questions: {str(e)}"
        )

@app.post("/get-ideal-answer")
async def get_ideal_answer(data: Dict = Body(...)):
    try:
        question = data.get("question", "")
        user_answer = data.get("answer", "")

        if not question or not user_answer:
            raise HTTPException(
                status_code=400,
                detail="Both question and user answer are required"
            )

        result = await ideal_answer_generator.generate_ideal_answer(question, user_answer)
        return result

    except Exception as e:
        logger.error(f"Error generating ideal answer: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate ideal answer: {str(e)}"
        )

app.include_router(users.router, prefix="/api/users", tags=["users"])

# This is needed for Vercel
app = app