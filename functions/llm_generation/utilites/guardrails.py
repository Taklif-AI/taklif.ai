from langchain_core.tracers.langchain import wait_for_all_tracers
from utilites.llm_load_balancer import send_request
from langsmith import traceable
from utilites.custom_exceptions import GenerationError
from decimal import Decimal
import ast


class Guardrails:
    def __init__(self):
        self.validators = ["interest", "assignment"]

    @traceable(
        name="Guardrails",
        run_type="llm",
        metadata={"app": "taklif.ai"},
    )
    def validate(self, validator_type: str, content: str, metadata: dict):
        try:
            if validator_type not in self.validators:
                raise ValueError(f"Unknown validator type: {validator_type}")

            if validator_type == "interest":
                guardrail_prompt = metadata["langsmith_client"].pull_prompt(
                    prompt_identifier="interest-guardrails-prompt"
                )
                prompt = guardrail_prompt.format(interest=content)

                return self.litellm_request(prompt=prompt, metadata=metadata)
            elif validator_type == "assignment":
                guardrail_prompt = metadata["langsmith_client"].pull_prompt(
                    prompt_identifier="assignment-guardrails-prompt"
                )
                prompt = guardrail_prompt.format(general_assignment=content)

                return self.litellm_request(prompt=prompt, metadata=metadata)
        except Exception as e:
            raise GenerationError(f"Guardrails Error: {str(e)}")
        # Wait for langsmith tracer to finish
        finally:
            wait_for_all_tracers()

    def litellm_request(self, prompt: str, metadata: dict):
        # Send request to guardrails LLM
        response = send_request(task="guardrails", prompt=prompt, metadata={})
        result = {
            "content": ast.literal_eval(response.content),
            "request_info": {
                "model": response.response_metadata["deployment"],
                "total_tokens": response.response_metadata["token_usage"].get(
                    "total_tokens", 0
                ),
                "total_time": Decimal(
                    str(
                        response.response_metadata["token_usage"].get(
                            "total_time", "0.0"
                        )
                    )
                ),
            },
        }

        return result
