from concurrent.futures import ThreadPoolExecutor
from langsmith import Client as LangSmith
from utilites.custom_exceptions import (
    BadRequestError,
    GenerationError,
    PDFDecodingError,
    PDFProcessingError,
)
from utilites.input_parser import generation_parser, simplify_parser
from utilites.guardrails import Guardrails
from utilites.llm_ocr import convert_pdf_to_markdown
from utilites.llm_gen_utils import assignment, simplify
import json
import os


GUARDRAILS_MODEL = "groq/llama-3.3-70b-specdec"
PERSONALIZATION_MODEL = "groq/llama-3.3-70b-versatile"


def handler(event, context):
    # Get the available memory in MB from the Lambda function
    available_memory = int(os.getenv("AWS_LAMBDA_FUNCTION_MEMORY_SIZE", "128"))
    # Estimate max threads based on available memory, use 1 thread per 128 MB of memory
    max_threads = max(1, available_memory // 128)
    
    try:
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
            elif task == "simplify":
                params = simplify_parser(body)
        except BadRequestError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": e.message}),
            }

        # Register langsmith client
        langsmith_client = LangSmith()
        
        # Register guardrails object
        guard = Guardrails()

        # Interest guardrail
        interest_validation = guard.validate(
            validator_type = "interest",
            content=params["interest"],
            metadata={
                "litellm_call": GUARDRAILS_MODEL,
                "langsmith_client": langsmith_client,
            },
        )
        if interest_validation["content"]["decision"] == "rejected":
            return {
                "statusCode": 400,
                  "body": json.dumps({
                    "rejected": interest_validation["content"]["explanation"],
                }),
            }

        # PDF assignment processing
        if task == "generation" and params.get("is_pdf") is True:
            try:
                params["general_assignment"] = convert_pdf_to_markdown(
                    base64_pdf=params.get("general_assignment"),
                    langsmith_client=langsmith_client,
                )
            except PDFDecodingError as e:
                return {
                    "statusCode": 400,
                    "body": json.dumps(
                        {"error": f"PDF Decoding error occurred: {str(e)}"}
                    ),
                }
            except PDFProcessingError as e:
                return {
                    "statusCode": 400,
                    "body": json.dumps(
                        {"error": f"PDF Processing error occurred: {str(e)}"}
                    ),
                }

        # Assignment guardrail
        assignment_validation = guard.validate(
            validator_type="assignment",
            content=params["general_assignment"]
            if task == "generation"
            else params["personalized_assignment"],
            metadata={
                "litellm_call": GUARDRAILS_MODEL,
                "langsmith_client": langsmith_client,
            },
        )
        if not assignment_validation["content"]["decision"]:
            return {
                "statusCode": 400,
                  "body": json.dumps({
                    "invalid_input": assignment_validation["content"]["invalid_input"],
                    "explanation": assignment_validation["content"]["decision_explain"],
                }),
            }

        # LLM calling
        response = ""
        try:
            if task == "generation":
                response = assignment.personalize(
                    params,
                    metadata={
                        "litellm_call": PERSONALIZATION_MODEL,
                        "langsmith_client": langsmith_client,
                    },
                )
            elif task == "simplify":
                response = simplify.simplify(
                    params,
                    metadata={
                        "litellm_call": PERSONALIZATION_MODEL,
                        "langsmith_client": langsmith_client,
                    },
                )
        except GenerationError as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "LLM Generation Error: " + str(e)}),
            }

        # Output guardrail
        output_validation = guard.validate(
            validator_type="output",
            content=response,
            metadata={
                "litellm_call": GUARDRAILS_MODEL,
                "langsmith_client": langsmith_client,
            },
        )
        if not output_validation["content"]["decision"]:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "invalid_input": output_validation["content"]["invalid_input"],
                    "explanation": output_validation["content"]["decision_explain"],
                }),
            }
            
        # Return the content from the LLM response
        return {"statusCode": 200, "body": json.dumps({"response": response})}
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error: " + str(e)}),
        }
