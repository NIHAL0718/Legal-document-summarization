from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from app.models.ocr import OCR
from app.models.summarizer import summarize_text_abstractive
import os

router = APIRouter()

# Initialize the OCR class (ensure correct Tesseract path)
ocr = OCR(tesseract_cmd="C:/Program Files/Tesseract-OCR/tesseract.exe")

@router.post("/process")
async def ocr_and_summarize(file: UploadFile = File(...), method: str = "abstractive"):
    """
    Endpoint to process an uploaded image or PDF for OCR and summarization.

    Args:
        file (UploadFile): The uploaded file (image or PDF).
        method (str): Summarization method ('extractive' or 'abstractive').

    Returns:
        JSONResponse: Extracted text and summary or error message.
    """
    try:
        # Save uploaded file temporarily
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(await file.read())

        # Determine if it's a PDF or an image
        if file.filename.lower().endswith(".pdf"):
            extracted_text_dict = ocr.extract_text_from_pdf(temp_file_path)
            extracted_text = " ".join(extracted_text_dict.values())  # Combine text from all pages
        else:
            extracted_text = ocr.extract_text_from_image_file(temp_file_path)

        # Summarize the extracted text
        if method == "abstractive":
            summary = summarize_text_abstractive(extracted_text)
        elif method == "extractive":
            summary = summarize_text_extractive(extracted_text)
        else:
            raise ValueError(f"Invalid summarization method: {method}. Use 'abstractive' or 'extractive'.")

        # Clean up temporary file
        os.remove(temp_file_path)

        # Return extracted text and summary as JSON
        return JSONResponse(content={"extracted_text": extracted_text, "summary": summary}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)