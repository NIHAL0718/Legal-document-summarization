from fastapi import APIRouter
from pydantic import BaseModel
from app.google_chatbot import ask_google_bot  # ✅ adjust import path to your structure

router = APIRouter()

class ChatRequest(BaseModel):
    extracted_text: str
    summary: str
    question: str

@router.post("/")
def chatbot_response(chat: ChatRequest):
    response = ask_google_bot(chat.extracted_text, chat.summary, chat.question)
    return {"answer": response}
