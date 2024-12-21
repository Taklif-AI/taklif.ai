from pyzerox import zerox
import os, stat
import asyncio
import base64
from utilites.custom_exceptions import PDFDecodingError


def save_base64_to_pdf(base64_string, file_path):
    """
    Converts a Base64 string to a PDF and saves it to the specified path.

    :param base64_string: The Base64 encoded string.
    :param file_path: The path where the PDF will be saved.
    """
    try:
        # Decode the Base64 string
        pdf_data = base64.b64decode(base64_string)

        #os.chmod('/var/tmp/', stat.S_IRWXU)
        
        # Write the binary PDF data to the specified file
        temp_pdf = open(file_path, 'wb')
        
        temp_pdf.write(pdf_data)
        temp_pdf.close()    
            
    except Exception as e:
        raise PDFDecodingError(f"Error decoding base64 PDF: {str(e)}")


# Define a function to process a PDF file into Markdown
async def convert_pdf_to_markdown(
    base64_pdf: str,
    model: str, # examples: gemini/gemini-1.5-flash-exp-0827 or gemini/gemini-1.5-flash-latest
    concurrency: int,
    langsmith_client,
    **kwargs
):
    """
    Convert the content of a PDF file to Markdown format using the specified model.

    Args:
        base64_pdf (str): Base64 PDF file.
        model (str): Model to use for conversion.
        concurrency (int): Number of pages to run at a time. Default is 10.
        langsmith_client: Langsmith client object.
        **kwargs: Additional arguments for the zerox function.

    Returns:
        str: Markdown content extracted from the PDF.
    """
    
    custom_system_prompt = langsmith_client.pull_prompt(prompt_identifier = "pdf-ocr-prompt")
    pdf_path = "/var/tmp/temp.pdf"
    save_base64_to_pdf(base64_pdf, pdf_path)
    
    return await zerox(
        file_path=pdf_path,
        model=model,
        custom_system_prompt=custom_system_prompt,
        concurrency=concurrency,
        **kwargs
    )
