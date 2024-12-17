from utilites.custom_exceptions import BadRequestError 
import json


def generation_parser(body:dict):
    # Extract params from body
    params = body.get('params')

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")
    
    return {
        "interest" : params.get("interest"),
        "is_pdf" : params.get("is_pdf"),
        "general_assignment" : params.get("general_assignment")
    }


def simplify_parser(body:dict):
    # Extract params from body
    params = body.get('params')

    if not params:
        raise BadRequestError("Bad Request: Missing 'params' in the event payload")
    
    return {
        "level" : params.get("level"),
        "general_assignment" : params.get("general_assignment")
    } 
     