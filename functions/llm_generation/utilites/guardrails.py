from litellm import completion
import ast


class Guardrails:
    def __init__(self):
        self.validators = [
            "interest",
            "assignment",
            "output"
        ]


    def validate(self, validator_type: str, content: str, metadata: dict):
        if validator_type not in self.validators:
            raise ValueError(f"Unknown validator type: {validator_type}")
        
        if validator_type == 'interest':
            guardrail_prompt = metadata['langsmith_client'].pull_prompt(prompt_identifier = "interest-guardrails-prompt")
            prompt = guardrail_prompt.format(interest = content)
            
            return self.litellm_request(prompt = prompt, metadata = metadata)
        elif validator_type == 'assignment':
            guardrail_prompt = metadata['langsmith_client'].pull_prompt(prompt_identifier = "assignment-guardrails-prompt")
            prompt = guardrail_prompt.format(general_assignment= content)
            
            return self.litellm_request(prompt = prompt, metadata = metadata)
        elif validator_type == 'output':
            guardrail_prompt = metadata['langsmith_client'].pull_prompt(prompt_identifier = "output-guardrails-prompt")
            prompt = guardrail_prompt.format(personalized_assignment = content)
            
            return self.litellm_request(prompt = prompt, metadata = metadata)
        

    def litellm_request(self, prompt: str, metadata:dict):
        # Send request to guardrails LLM
        evaluation_result = completion(
            model= metadata['litellm_call'],
            messages=[{"content": prompt, "role": "system"}],
        )
        result = {
            "content": ast.literal_eval(
                evaluation_result["choices"][0]["message"]["content"]
            ),
            "request_info": {
                "model": evaluation_result["model"],
                "completion_tokens": evaluation_result["usage"].completion_tokens,
                "prompt_tokens": evaluation_result["usage"].prompt_tokens,
                "total_tokens": evaluation_result["usage"].total_tokens,
                "completion_tokens_details" :evaluation_result["usage"].completion_tokens_details,
                "prompt_tokens_details": evaluation_result["usage"].prompt_tokens_details
            },
        }
        
        return result