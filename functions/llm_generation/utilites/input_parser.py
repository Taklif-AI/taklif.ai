import json
from utilites.custom_exceptions import BadRequestError


def personalization_parser(body: dict):
    # Extract params from body
    params = body.get("params")

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")

    return {
        "interest": params.get("interest"),
        "is_pdf": bool(params.get("is_pdf")),
        "general_assignment": params.get("general_assignment"),
        "user_id": params.get("user_id"),
        "run_id": params.get("run_id"),
        "personalization_id": params.get("personalization_id"),
    }


def simplify_parser(body: dict):
    # Extract params from body
    params = body.get("params")

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")

    return {
        "interest": params.get("interest"),
        "personalized_assignment": params.get("personalized_assignment"),
        "user_id": params.get("user_id"),
        "run_id": params.get("run_id"),
        "personalization_id": params.get("personalization_id"),
        "simplification_id": params.get("simplification_id"),
    }
