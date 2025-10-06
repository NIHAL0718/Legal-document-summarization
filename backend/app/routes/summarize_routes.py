from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.ocr_service import perform_ocr
from app.models.summarizer import summarize_text_abstractive
import pytesseract
from PIL import Image
import io
import fitz  # PyMuPDF
import os
import logging

router = APIRouter()

@router.post("/process")
async def process_document(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file provided")

        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file provided")

        extracted_text = ""
        temp_file_path = None

        try:
            temp_file_path = f"temp_{file.filename}"
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(content)

            if file.content_type.startswith('image/'):
                # Image file: perform OCR directly
                image = Image.open(temp_file_path)
                extracted_text = perform_ocr(image)
                logging.info(f"OCR extracted text from image: {extracted_text[:100]}...")
            
            elif file.content_type == 'application/pdf':
                # PDF file: extract text + images + OCR images
                # Try different PyMuPDF approaches to handle version differences
                try:
                    # First try with fitz.open()
                    pdf_document = fitz.open(temp_file_path)
                except AttributeError:
                    try:
                        # Then try with fitz.Document()
                        pdf_document = fitz.Document(temp_file_path)
                    except AttributeError:
                        # Last resort: direct import and use
                        import fitz as pymupdf
                        pdf_document = pymupdf.open(temp_file_path)
                
                extracted_text = ""

                # Extract text from all pages
                for page in pdf_document:
                    extracted_text += page.get_text()

                # Extract images and OCR each image
                for page_index in range(len(pdf_document)):
                    page = pdf_document[page_index]
                    image_list = page.get_images(full=True)
                    logging.info(f"Page {page_index} has {len(image_list)} images.")

                    for img_index, img in enumerate(image_list):
                        xref = img[0]
                        base_image = pdf_document.extract_image(xref)
                        image_bytes = base_image["image"]
                        image_ext = base_image["ext"]

                        # Open image with PIL from bytes
                        image = Image.open(io.BytesIO(image_bytes))
                        
                        # Perform OCR on extracted image
                        ocr_text = perform_ocr(image)
                        if ocr_text.strip():
                            extracted_text += "\n\n[OCR from embedded image on page {}]:\n".format(page_index + 1)
                            extracted_text += ocr_text

                pdf_document.close()
                logging.info(f"Total extracted text + OCR from PDF: {extracted_text[:200]}...")
            
            else:
                # Treat as text file
                with open(temp_file_path, 'r', encoding='utf-8') as text_file:
                    extracted_text = text_file.read()
                logging.info(f"Text file content: {extracted_text[:100]}...")

            if not extracted_text.strip():
                raise HTTPException(status_code=400, detail="No text could be extracted from the file")

            logging.info("Generating summary...")
            raw_summary, formatted_summary = summarize_text_abstractive(extracted_text)
            logging.info(f"Generated summary: {formatted_summary[:100]}...")

            return JSONResponse({
                "status": "success",
                "extracted_text": extracted_text,
                "summary": formatted_summary
            })

        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Error processing document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))