from concurrent.futures import ThreadPoolExecutor
from langsmith import Client as LangSmith
from utilites.custom_exceptions import (
    BadRequestError,
    GenerationError,
    PDFDecodingError,
    PDFProcessingError,
)
from utilites.input_parser import personalization_parser, simplify_parser
from utilites.guardrails import Guardrails
from utilites.llm_ocr import convert_pdf_to_markdown
from utilites.llm_gen_utils import assignment, simplify
from datetime import datetime, timezone
import boto3
import json
import os

client = boto3.client("dynamodb")
dynamodb = boto3.resource("dynamodb")

env_name = os.environ.get("ENV_NAME", "Development")
table_name = f"{env_name}-AssignmentsTable"
assignments_table = dynamodb.Table(table_name)


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
            if task == "personalization":
                params = personalization_parser(body)
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
            validator_type="interest",
            content=params["interest"],
            metadata={
                "langsmith_client": langsmith_client,
            },
        )
        if interest_validation["content"]["decision"] == "rejected":
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {
                        "guardrail": "interest",
                        "rejected": interest_validation["content"]["explanation"],
                    }
                ),
            }

        # PDF assignment processing
        if task == "personalization" and params.get("is_pdf") is True:
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
            if task == "personalization"
            else params["personalized_assignment"],
            metadata={
                "langsmith_client": langsmith_client,
            },
        )
        if assignment_validation["content"]["decision"] == "rejected":
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {
                        "guardrail": "assignment",
                        "rejected": assignment_validation["content"]["explanation"],
                    }
                ),
            }

        # LLM calling
        response = ""
        try:
            if task == "personalization":
                response = assignment.personalize(
                    params,
                    metadata={
                        "langsmith_client": langsmith_client,
                    },
                )
            elif task == "simplify":
                response = simplify.simplify(
                    params,
                    metadata={
                        "langsmith_client": langsmith_client,
                    },
                )
        except GenerationError as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": "LLM Generation Error: " + str(e)}),
            }

        # Output guardrail
        assignment_output_validation = guard.validate(
            validator_type="assignment",
            content=response.content,
            metadata={
                "langsmith_client": langsmith_client,
            },
        )
        if assignment_output_validation["content"]["decision"] == "rejected":
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {
                        "guardrail": "model_output",
                        "rejected": assignment_output_validation["content"][
                            "explanation"
                        ],
                    }
                ),
            }

        temp_response_dict = json.loads(response.content)

        # Populate the db_record
        db_record = {
            "PK": params['user_id'],
            "SK": f"RUN#{params['run_id']}#PERSONALIZATION#{params['personalization_id']}"
            if task == "personalization"
            else f"RUN#{params['run_id']}#PERSONALIZATION#{params['personalization_id']}#SIMPLIFICATION#{params['simplification_id']}",
            "request_origin": params.get("request_origin", "web"),
            "item_type": task.capitalize(),
            "run_id": params["run_id"],
            "personalization_id": params["personalization_id"],
            "simplification_id": params["simplification_id"]
            if task == "simplify"
            else "",
            "user_input": {
                "interest": params["interest"],
                "assignment": params["general_assignment"]
                if task == "personalization"
                else params["personalized_assignment"],
                "is_PDF": params["is_pdf"],
            },
            "model_output": {
                "title": temp_response_dict["assignment_title"],
                "content": temp_response_dict["assignment_content"],
            },
            "interest_guardrail_decision": {
                "decision": interest_validation["content"]["decision"],
                "explanation": interest_validation["content"]["explanation"],
                "request_info": interest_validation["request_info"],
            },
            "assignment_guardrail_decision": {
                "decision": assignment_validation["content"]["decision"],
                "explanation": assignment_validation["content"]["explanation"],
                "request_info": assignment_validation["request_info"],
            },
            "output_guardrail_decision": {
                "decision": assignment_output_validation["content"]["decision"],
                "explanation": assignment_output_validation["content"]["explanation"],
                "request_info": assignment_output_validation["request_info"],
            },
            "metadata": {
                "request_id": context.aws_request_id,
                "model_name": response.response_metadata["deployment"],
                "model_id": response.response_metadata["model_info"]["id"],
                "model_group": response.response_metadata["model_group"],
                "model_group_size": response.response_metadata["model_group_size"],
                "input_tokens": response.response_metadata["prompt_tokens"],
                "output_tokens": response.response_metadata["completion_tokens"],
                "queue_time": response.response_metadata["queue_time"],
                "prompt_processing_time": response.response_metadata["prompt_time"],
                "completion_output_time": response.response_metadata["completion_time"],
            },
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        assignments_table.put_item(Item=db_record)

        # Return the content from the LLM response
        return {"statusCode": 200, "body": json.dumps({"response": response.content})}
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error: " + str(e)}),
        }
