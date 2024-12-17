import interest_validator 
import assignment_validator 


def guard_interest(interest: str, metadata: dict):
    """Performs guardrails on interest

    Args:
        interest (str): user's interest
        metadata (dict): {llm_call}

    Returns:
        _type_: response dict
    """
    # build validator
    interestValidator = interest_validator.InterestValidator(use_local=True)

    # make the validation request
    interest_validation = interestValidator.validate(interest, metadata=metadata)
    decision = interest_validation.metadata["content"]["decision"]

    # return response
    return {
            "statusCode": 200 if decision else 400,
            "body": {
                "decision_explain": interest_validation.metadata["content"][
                    "explanation"
                ],
                "request_info": interest_validation.metadata["request_info"],
            },
        }


def guard_assignment(assignment: str, metadata: dict):
    """Performs guardrails on assignment

    Args:
        interest (str): user's assignment
        metadata (dict): {llm_call}

    Returns:
        _type_: response dict
    """
    # build validator
    assignmentValidator = assignment_validator.AssignmentValidator()

    # make the validation request
    assignment_validation = assignmentValidator.validate(assignment, metadata=metadata)

    # return response
    decision = assignment_validation.metadata["content"]["decision"]
    return {
            "statusCode": 200 if decision else 400,
            "body": {
                "decision_explain": assignment_validation.metadata["content"][
                    "explanation"
                ],
                "request_info": assignment_validation.metadata["request_info"],
            },
        }

