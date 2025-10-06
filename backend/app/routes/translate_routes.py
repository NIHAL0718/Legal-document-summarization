from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from deep_translator import GoogleTranslator  # pip install deep-translator

router = APIRouter()

class TranslationRequest(BaseModel):
    summary: Optional[str] = Field(None)
    extracted_text: Optional[str] = Field(None)
    target_language: str

@router.post("/")
async def translate(request: TranslationRequest):
    if not request.summary and not request.extracted_text:
        raise HTTPException(status_code=400, detail="At least one of summary or extracted_text must be provided.")

    try:
        # Function to translate text using GoogleTranslator
        def translate_text(text: str, target_lang: str) -> str:
            if not text.strip():
                return ""
            return GoogleTranslator(source='auto', target=target_lang).translate(text)

        translated_summary = None
        translated_text = None

        if request.summary:
            translated_summary = translate_text(request.summary, request.target_language)
        if request.extracted_text:
            translated_text = translate_text(request.extracted_text, request.target_language)

        return {
            "translated_summary": translated_summary,
            "translated_text": translated_text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")
