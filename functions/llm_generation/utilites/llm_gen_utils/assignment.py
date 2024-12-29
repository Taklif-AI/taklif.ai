from utilites.custom_exceptions import GenerationError
from langchain_core.tracers.langchain import wait_for_all_tracers
from langsmith import traceable
from ..llm_load_balancer import send_request


# TODO: use llm_load_balancer functions
@traceable(
    name="Personalize",
    run_type="llm",
    metadata={"app": "taklif.ai"},
)
def personalize(prompt_params: dict, metadata: dict):
    try:
        interest = prompt_params.get("interest")
        general_assignment = prompt_params.get("general_assignment")

        # Prepare the prompt
        langsmith_prompt = (
            metadata["langsmith_client"]
            .pull_prompt(prompt_identifier="personalize-assignment-prompt")
            .format(interest=interest, general_assignment=general_assignment)
        )

        # use load_balancer to make litellm request
        response = send_request(prompt=langsmith_prompt, metadata={})

        return response
    except Exception as e:
        raise GenerationError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish
    finally:
        wait_for_all_tracers()
