import pytesseract
from PIL import Image
import logging

def perform_ocr(image: Image.Image) -> str:
    """
    Perform OCR on an image to extract text.
    
    Args:
        image (PIL.Image): The image to process
        
    Returns:
        str: Extracted text from the image
    """
    try:
        # Configure Tesseract parameters for better accuracy
        custom_config = r'--oem 3 --psm 6'
        
        # Perform OCR
        text = pytesseract.image_to_string(image, config=custom_config)
        
        if not text.strip():
            raise Exception("No text could be extracted from the image")
            
        return text.strip()
    except Exception as e:
        logging.error(f"OCR processing failed: {str(e)}")
        raise Exception(f"OCR processing failed: {str(e)}") 