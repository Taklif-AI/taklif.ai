from typing import Any, Dict
from guardrails.validator_base import (
    FailResult,
    PassResult,
    ValidationResult,
    Validator,
    register_validator,
    ErrorSpan,
)
from typing import Optional, Callable
from langchain import hub
from litellm import completion
import ast


@register_validator(name="guardrails/interest_validator", data_type="string")
class InterestValidator(Validator):
    def __init__(
        self,
        on_fail: Optional[Callable] = None,
        **kwargs,
    ):
        super().__init__(on_fail=on_fail, **kwargs)
        self.rail_alias = "interest_validator"

    def _validate(self, value: Any, metadata: Dict[str, Any]) -> ValidationResult:
        if not isinstance(value, str):
            return FailResult(
                metadata=metadata,
                error_message="Input must be a string.",
                fix_value=None,
            )
        # perform guarding
        inference_result = self._inference_remote(interest=value, metadata=metadata)

        if inference_result["content"]["decision"]:
            return PassResult(metadata=inference_result)
        else:
            return FailResult(
                error_message="Unacceptable interest", metadata=inference_result
            )

    def _inference_local(self, model_input: str) -> bool:
        """Implement a function to perform inference on a local machine."""
        return model_input.islower()

    def _inference_remote(self, metadata: dict, interest: str) -> bool:

        """Implement a function that will build a request and perform inference on a
        remote machine. This is not required if you will always use local mode.
        """
        interest_guardrail_prompt = hub.pull("interest-guardrails-prompt")
        prompt = interest_guardrail_prompt.format(interest=interest)

        # send request to guardrails LLM
        evaluated_interest = completion(
            model=metadata['litellm_call'],
            messages=[{"content": prompt, "role": "system"}],
        )
        res = {
            "content": ast.literal_eval(
                evaluated_interest["choices"][0]["message"]["content"]
            ),
            "request_info": {
                "model": evaluated_interest["model"],
                "completion_tokens": evaluated_interest["usage"].completion_tokens,
                "prompt_tokens": evaluated_interest["usage"].prompt_tokens,
                "total_tokens": evaluated_interest["usage"].total_tokens,
            },
        }
        # parse the response
        try:
            return res
        except Exception as e:
            return ast.literal_eval(e)
