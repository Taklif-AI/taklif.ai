from utilites.input_parsers import generation_parser, simplify_parser
from concurrent.futures import ThreadPoolExecutor
from utilites.pdf_ocr import pdf_ocr
from utilites.llm_generators import assignment, simplify
from utilites.guardrails_utils import llm_guard
import json
import os

# TODO: atomic_counter_load_balancer

def handler(event, context):
    # Get the available memory in MB from the Lambda function
    available_memory = int(os.getenv("AWS_LAMBDA_FUNCTION_MEMORY_SIZE", "128"))
    # Estimate max threads based on available memory, use 1 thread per 128 MB of memory
    max_threads = max(1, available_memory // 128)

    body = json.loads(event.get('body', '{}'))

    # Extract task from body
    task = body.get("task")
    if not task:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Bad Request: Missing 'task' in the event payload"})
        }
    
    # Parse body parameters
    params = {}
    try:
        if task == "generation":
            params = generation_parser.parse(body.get('params'))
        elif task == "simplify":
            params = simplify_parser.parse(body.get('params'))     
    except BadRequestError as e:
        return {
        "statusCode": 400,
        "body": json.dumps({"error": e.message}),
        }
  
    # Interest guardrails
    
    # PDF assignment processing
    if task == "generation" and params.get("is_pdf") == True:
        try:
            params['general_assignment'] = pdf_ocr(params.get('general_assignment'), max_threads)
        except PDFDecodingError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"PDF Decoding error occurred: {str(e)}"})
            }
        except PDFProcessingError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"PDF Processing error occurred: {str(e)}"})
            }
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Unexpected error: {str(e)}"})
            }

    # Assignment guardrails
    
    # LLM calling
    response = ''
    try:
        if task == "generation":
            response = assignment.generate(body.get('params'), "openrouter/meta-llama/llama-3.2-3b-instruct:free")
        elif task == "simplify":
            response = simplify.generate(body.get('params'), "openrouter/meta-llama/llama-3.2-3b-instruct:free")     
    except GenerateError as e:
        return {
        "statusCode": 500,
        "body": json.dumps({"error": "Internal Server Error: " + str(e)}),
        }
  
    # Output guardrails

    # Return the content from the LLM response
    return {
        "statusCode": 200,
        "body": json.dumps({"response": response})
    }