from concurrent.futures import ThreadPoolExecutor
import pytesseract
import numpy as np
import base64
import io
import fitz  # PyMuPDF
import cv2
import os


# Custom exception classes
class PDFDecodingError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message


class PDFProcessingError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message


# Helper function to decode PDF base64
def decode_pdf(base64_pdf):
    try:
        return base64.b64decode(base64_pdf)  # Return the raw byte content
    except Exception as e:
        raise PDFDecodingError(f"Error decoding base64 PDF: {str(e)}")


# Helper function to process a single page and extract text
def process_page(page):
    try:
        # Convert page to image (pixmap)
        pix = page.get_pixmap(alpha=False)  # Disable alpha channel for RGB images
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)  # Use pix.n to determine the number of channels

        # Convert image to grayscale (optional)
        if pix.n == 3:  # RGB image
            gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        elif pix.n == 4:  # RGBA image
            gray = cv2.cvtColor(img, cv2.COLOR_RGBA2GRAY)
        else:  # Handle cases where pix.n is not 3 or 4
            raise ValueError(f"Unsupported image format with {pix.n} channels")

        # Extract text from the image using Tesseract OCR
        return pytesseract.image_to_string(gray)
    except Exception as e:
        raise PDFProcessingError(f"Error processing page: {str(e)}")


# Main OCR function
def pdf_ocr(base64_pdf, max_threads):
    try:
        # Decode PDF and load pages
        pdf_bytes = decode_pdf(base64_pdf)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")  # Open the PDF as a byte stream
        pages = [doc.load_page(i) for i in range(len(doc))]

        # Process pages in parallel
        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            results = list(executor.map(process_page, pages))

        # Combine results into a single string
        return "".join(results)

    except PDFDecodingError as decode_err:
        raise decode_err
    except PDFProcessingError as process_err:
        raise process_err
    except Exception as e:
        raise PDFProcessingError(f"Unexpected error: {str(e)}")