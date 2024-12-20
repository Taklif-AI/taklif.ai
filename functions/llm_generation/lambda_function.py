import json
import os
from concurrent.futures import ThreadPoolExecutor

from langsmith import Client as LangSmith
from utilites.custom_exceptions import (BadRequestError, GenerateError,
                                        PDFDecodingError, PDFProcessingError)
from utilites.guardrails_utils.llm_guard import (guard_assignment,
                                                 guard_interest)
from utilites.input_parser import generation_parser, rephrase_parser
from utilites.llm_gen_utils import assignment, rephrase
from utilites.pdf_ocr import process_pdf

#TODO: atomic_counter_load_balancer

def handler(event, context):
    # Get the available memory in MB from the Lambda function
    available_memory = int(os.getenv("AWS_LAMBDA_FUNCTION_MEMORY_SIZE", "128"))
    # Estimate max threads based on available memory, use 1 thread per 128 MB of memory
    max_threads = max(1, available_memory // 128)

    body = json.loads(event.get("body", "{}"))

    # Extract task from body
    task = body.get("task")
    if not task:
        return {
            "statusCode": 400,
            "body": json.dumps(
                {"error": "Bad Request: Missing 'task' in the event payload"}
            ),
        }

    # Parse body parameters
    params = {}
    try:
        if task == "generation":
            params = generation_parser(body)
        elif task == "rephrase":
            params = rephrase_parser(body)
    except BadRequestError as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": e.message}),
        }

    # Register langsmith client
    langsmith_client = LangSmith()

    # Interest guardrails
    interest_validation = guard_interest(
        interest=params["interest"],
        metadata={
            "litellm_call": "groq/llama-3.3-70b-specdec",
            "langsmith_client": langsmith_client,
        },
    )

    if interest_validation["decision"] == "rejected":
        return {
            "statusCode": 400,
            "body": json.dumps(
                {"error": interest_validation["details"]["decision_explain"]}
            ),
        }

    # PDF assignment processing
    if task == "generation" and params.get("is_pdf") == "true":
        try:
            params["general_assignment"] = process_pdf(
                params.get("general_assignment"), max_threads
            )
        except PDFDecodingError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": f"PDF Decoding error occurred: {str(e)}"}),
            }
        except PDFProcessingError as e:
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {"error": f"PDF Processing error occurred: {str(e)}"}
                ),
            }
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Unexpected error: {str(e)}"}),
            }

    # Assignment guardrails
    assignment_validation = guard_assignment(
        assignment=params["general_assignment"] if task == "generation" else params["personalized_assignment"],
        metadata={
            "litellm_call": "groq/llama-3.3-70b-specdec",
            "langsmith_client": langsmith_client,
        },
    )
    if assignment_validation["decision"] == "rejected":
        return {
            "statusCode": 400,
            "body": json.dumps(
                {"error": assignment_validation["details"]["decision_explain"]}
            ),
        }

    # LLM calling
    response = ""
    try:
        if task == "generation":
            response = assignment.generate(
                params,
                metadata={
                    "litellm_call": "groq/llama-3.3-70b-versatile",
                    "langsmith_client": langsmith_client,
                },
            )
        elif task == "rephrase":
            response = rephrase.generate(
                params,
                metadata={
                    "litellm_call": "groq/llama-3.3-70b-versatile",
                    "langsmith_client": langsmith_client,
                },
            )
    except GenerateError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error: " + str(e)}),
        }

    # Output guardrails

    # Return the content from the LLM response
    return {"statusCode": 200, "body": json.dumps({"response": response})}
