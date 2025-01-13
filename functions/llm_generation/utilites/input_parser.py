import json
from utilites.custom_exceptions import BadRequestError


def generation_parser(body: dict):
    # Extract params from body
    params = body.get("params")

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")

    return {
        "interest": params.get("interest"),
        "is_pdf": bool(params.get("is_pdf")),
        "general_assignment": params.get("general_assignment"),
    }


def simplify_parser(body: dict):
    # Extract params from body
    params = body.get("params")

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")

    return {
        "interest": params.get("interest"),
        "personalized_assignment": params.get("personalized_assignment"),
    }
