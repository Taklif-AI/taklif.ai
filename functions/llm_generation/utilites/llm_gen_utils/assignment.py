import utilites.general_utils.exceptions as exceptions 
from langchain_core.tracers.langchain import wait_for_all_tracers
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_models import ChatLiteLLM
from langsmith import traceable
from langchain import hub
import json


@traceable(
# TODO: Add ls_provider, ls_model_name
  run_type= "llm",
  metadata={"app": "taklif.ai"},
)
def generate(prompt_params:dict, litellm_call:str):
    try:
        interest = prompt_params.get("interest")
        general_assignment = prompt_params.get("general_assignment")

        # Prepare the prompt  
        langsmith_prompt = hub.pull("personalize-assignment-prompt")

        # Invoke the LLM
        llm = ChatLiteLLM(model=litellm_call) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input = {
                                                "interest": interest,
                                                "general_assignment": general_assignment
                                                })

        return response
    except Exception as e:
        raise exceptions.GenerateError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()