from langchain_core.tracers.langchain import wait_for_all_tracers
from utilites.custom_exceptions import GenerationError
from langsmith import traceable
from utilites.llm_load_balancer import send_request


@traceable(
    name="Simplify",
    run_type="llm",
    metadata={"app": "taklif.ai"},
)
def simplify(prompt_params: dict, metadata: dict):
    try:
        personalized_assignment = prompt_params.get("personalized_assignment")
        interest = prompt_params.get("interest")

        # Prepare the prompt
        langsmith_prompt = (
            metadata["langsmith_client"]
            .pull_prompt(prompt_identifier="simplify-assignment-prompt")
            .format(assignment=personalized_assignment, interest=interest)
        )

        # Use load_balancer to make llm request
        response = send_request(
            task="simplification", prompt=langsmith_prompt, metadata={}
        )
        # Return the content from the LLM response
        return response

    except Exception as e:
        raise GenerationError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish
    finally:
        wait_for_all_tracers()
