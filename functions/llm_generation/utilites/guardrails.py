from litellm import completion
import ast
from llm_load_balancer import send_request
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
        
        response = send_request(prompt= prompt, metadata= {})
        result = {
            "content": ast.literal_eval(
                response.content
            ),
            "request_info": {
                "model_group": response.response_metadata["model_group"],
                "model": response.response_metadata['deployment'],
                "token_usage": response.response_metadata["token_usage"],
            },
        }
        
        return result