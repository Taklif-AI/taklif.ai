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
from litellm import completion
from langchain import hub
import ast


@register_validator(name="guardrails/assignment_validator", data_type="string")
class AssignmentValidator(Validator):
    def __init__(
        self,
        on_fail: Optional[Callable] = None,
        **kwargs,
    ):
        super().__init__(on_fail=on_fail, **kwargs)
        self.rail_alias = "assignment_validator"

    def _validate(self, value: Any, metadata: Dict[str, Any]) -> ValidationResult:
        if not isinstance(value, str):
            return FailResult(
                metadata=metadata,
                error_message="Input must be a string.",
                fix_value=None,
            )
        # perform guarding

        inference_result = self._inference_remote(assignment = value, metadata=metadata)
        
        if inference_result["content"]["decision"]:
            return PassResult(
                metadata = inference_result
            )
        else:
            return FailResult(
                error_message= "Unacceptable assignment",
                metadata = inference_result
            )
      

    def _inference_local(self, model_input: str) -> bool:
        """Implement a function to perform inference on a local machine."""
        return model_input.islower()

    def _inference_remote(self,litellm_call: str, assignment: str) -> bool:
        """Implement a function that will build a request and perform inference on a
        remote machine. This is not required if you will always use local mode.
        """
        assignment_guardrail_prompt = hub.pull("assignment-guardrails-prompt")
        prompt = assignment_guardrail_prompt.format(assignment= assignment)
        # send request to guardrails LLM
        evaluated_assignment = completion(model= litellm_call, 
                                        messages=[{ "content": prompt,"role": "system"}])

        # parse the response
        res = {
                    "content": ast.literal_eval(evaluated_assignment["choices"][0]["message"]["content"]),
                    "model": evaluated_assignment["model"],
                    "completion_tokens": evaluated_assignment["usage"].completion_tokens,
                    "prompt_tokens": evaluated_assignment["usage"].prompt_tokens,
                    "total_tokens": evaluated_assignment["usage"].total_tokens,
                }
        try:    
            
            return res
        except Exception as e:
            return ast.literal_eval(e)
       
