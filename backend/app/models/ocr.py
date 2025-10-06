import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import cv2
import numpy as np


class OCR:
    def __init__(self, tesseract_cmd=None):
        """
        Initialize the OCR class.

        Args:
            tesseract_cmd (str): Optional path to the Tesseract OCR executable.
        """
        if tesseract_cmd:
            pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    def preprocess_image(self, image):
        """
        Preprocess an image for better OCR accuracy.

        Args:
            image (numpy.ndarray): The image to preprocess.

        Returns:
            numpy.ndarray: Preprocessed binary image.
        """
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            # Apply binary thresholding
            _, binary_image = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
            return binary_image
        except Exception as e:
            print(f"Error during image preprocessing: {e}")
            return image

    def extract_text_from_image(self, image):
        """
        Perform OCR on an image.

        Args:
            image (PIL.Image.Image): The image object.

        Returns:
            str: Extracted text from the image.
        """
        try:
            # Convert PIL image to NumPy array
            np_image = np.array(image)
            # Preprocess the image
            preprocessed_image = self.preprocess_image(np_image)
            # Perform OCR
            text = pytesseract.image_to_string(preprocessed_image, lang="eng", config="--psm 6")
            return text.strip()
        except Exception as e:
            return f"Error during OCR: {e}"

    def extract_images_from_pdf(self, pdf_path):
        """
        Extract images from a PDF file.

        Args:
            pdf_path (str): Path to the PDF file.

        Returns:
            list: List of tuples containing page number and extracted PIL images.
        """
        images = []
        try:
            with fitz.open(pdf_path) as doc:
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    for img_index, img in enumerate(page.get_images(full=True)):
                        xref = img[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        images.append((page_num + 1, Image.open(io.BytesIO(image_bytes))))
        except Exception as e:
            print(f"Error extracting images from PDF: {e}")
        return images

    def extract_text_from_pdf(self, pdf_path):
        """
        Extract text from images embedded in a PDF file.

        Args:
            pdf_path (str): Path to the PDF file.

        Returns:
            dict: A dictionary with page numbers as keys and extracted text as values.
        """
        extracted_text = {}
        try:
            images = self.extract_images_from_pdf(pdf_path)
            for page_num, image in images:
                text = self.extract_text_from_image(image)
                extracted_text[f"Page {page_num}"] = text
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
        return extracted_text

    def extract_text_from_image_file(self, image_path):
        """
        Extract text from an image file.

        Args:
            image_path (str): Path to the image file.

        Returns:
            str: Extracted text from the image.
        """
        try:
            image = Image.open(image_path)
            return self.extract_text_from_image(image)
        except Exception as e:
            return f"Error processing image file: {e}"


# Example Usage
if __name__ == "__main__":
    ocr = OCR()  # Set tesseract_cmd if needed
    pdf_path = "example_document.pdf"
    image_path = "example_image.png"

    # Extract text from an image file
    print("Extracting text from image...")
    image_text = ocr.extract_text_from_image_file(image_path)
    print(f"Extracted Text from Image:\n{image_text}")

    # Extract text from a PDF file
    print("\nExtracting text from PDF...")
    pdf_text = ocr.extract_text_from_pdf(pdf_path)
    for page, text in pdf_text.items():
        print(f"\n{page}:\n{text}")
