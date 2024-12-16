from concurrent.futures import ThreadPoolExecutor
import pytesseract
import numpy as np
import base64
import io
import fitz  # PyMuPDF
import cv2
import os


# Helper function to decode PDF base64
def decode_pdf(base64_pdf):
    return base64.b64decode(base64_pdf)  # Return the raw byte content


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
        return f"Error processing page: {str(e)}"

def handler(event, context):
    try:
        # Get the available memory in MB from the Lambda function
        available_memory = int(os.getenv("AWS_LAMBDA_FUNCTION_MEMORY_SIZE", "128"))
        # Estimate max threads based on available memory, use 1 thread per 128 MB of memory
        max_threads = max(1, available_memory // 128)

        # Decode PDF and load pages
        base64_pdf = event['body']
        pdf_bytes = decode_pdf(base64_pdf)
        # Open the PDF with PyMuPDF (fitz)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")  # Use the byte stream
        pages = [doc.load_page(i) for i in range(len(doc))]

        # Process pages in parallel with a maximum number of threads
        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            results = list(executor.map(process_page, pages))
        
        # Combine results
        text = "".join(results)
        
        return {
            'statusCode': 200,
            'body': text,
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f"Error processing the PDF: {str(e)}",
        }