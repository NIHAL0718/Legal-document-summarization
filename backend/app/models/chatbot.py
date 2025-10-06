from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import logging

# Create router
router = APIRouter()

# Define request model
class ChatRequest(BaseModel):
    question: str
    context: str

# Load FLAN-T5 or any other QnA model
try:
    qa_pipeline = pipeline("question-answering", model="google/flan-t5-base", tokenizer="google/flan-t5-base")
except Exception as e:
    logging.error(f"Failed to load model: {e}")
    raise

@router.post("/chatbot")
async def chatbot(request: ChatRequest):
    try:
        response = qa_pipeline({
            "question": request.question,
            "context": request.context
        })
        return {"answer": response["answer"]}
    except Exception as e:
        logging.error(f"Chatbot error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during chatbot processing.")
