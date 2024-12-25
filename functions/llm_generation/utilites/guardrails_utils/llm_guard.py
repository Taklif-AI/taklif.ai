import utilites.guardrails_utils.interest_validator as interest_validator
import utilites.guardrails_utils.assignment_validator as assignment_validator
import utilites.guardrails_utils.output_validator as output_validator 


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
            "decision": "accepted" if decision else "rejected",
            "details": {
                "invalid_input": interest_validation.metadata["content"]["invalid_input"],
                "decision_explain": interest_validation.metadata["content"]["explanation"],
                "request_info": interest_validation.metadata["request_info"],
            },
        }


def guard_assignment(assignment: str, metadata: dict):
    """Performs guardrails on assignment

    Args:
        assignment (str): user's assignment
        metadata (dict): {llm_call, langsmith_client}

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
            "decision": "accepted" if decision else "rejected",
            "details": {
                "invalid_input": assignment_validation.metadata["content"]["invalid_input"],
                "decision_explain": assignment_validation.metadata["content"]["explanation"],
                "request_info": assignment_validation.metadata["request_info"],
            },
        }


def guard_llm_output(personalized_assignment: str, metadata: dict):
    """Performs guardrails on LLM output (personalized assignment)

    Args:
        personalized_assignment (str): LLM output
        metadata (dict): {llm_call, langsmith_client}

    Returns:
        _type_: response dict
    """
    # build validator
    validator = output_validator.OutputValidator()

    # make the validation request
    output_validation = validator.validate(personalized_assignment, metadata=metadata)

    # return response
    decision = output_validation.metadata["content"]["decision"]
    return {
            "decision": "accepted" if decision else "rejected",
            "details": {
                "invalid_input": output_validation.metadata["content"]["invalid_input"],
                "decision_explain": output_validation.metadata["content"]["explanation"],
                "request_info": output_validation.metadata["request_info"],
            },
        }
