from llama_parse import LlamaParse
import os
import base64
from utilites.custom_exceptions import PDFDecodingError, PDFProcessingError


def save_base64_to_pdf(base64_string, file_path):
    """
    Converts a Base64 string to a PDF and saves it to the specified path.

    :param base64_string: The Base64 encoded string.
    :param file_path: The path where the PDF will be saved.
    """
    try:
        # Decode the Base64 string
        pdf_data = base64.b64decode(base64_string)
        
        # Write the binary PDF data to the specified file
        temp_pdf = open(file_path, 'wb')
        
        temp_pdf.write(pdf_data)
        temp_pdf.close()
            
    except Exception as e:
        raise PDFDecodingError(f"Error decoding base64 PDF: {str(e)}")


# Define a function to process a PDF file into Markdown
def convert_pdf_to_markdown(
    base64_pdf: str,
    langsmith_client,
    **kwargs
):
    """
    Convert the content of a PDF file to Markdown format using the specified model.

    Args:
        base64_pdf (str): Base64 PDF file.
        langsmith_client: Langsmith client object.
        **kwargs: Additional arguments for the zerox function.

    Returns:
        str: Markdown content extracted from the PDF.
    """
    
    custom_system_prompt = langsmith_client.pull_prompt(prompt_identifier = "pdf-ocr-prompt")
    pdf_path = "/tmp/temp.pdf"
    save_base64_to_pdf(base64_pdf, pdf_path)
    
    try: 
        document = LlamaParse(result_type="markdown",
                            parsing_instruction = custom_system_prompt.messages[0].prompt.template
                            ).load_data(pdf_path)
        
        content = ''.join(page.text for page in document)
        
        return content
    except Exception as e:
        raise PDFProcessingError(f"Error processing PDF: {str(e)}")
