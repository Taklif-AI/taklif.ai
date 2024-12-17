from langchain_core.tracers.langchain import wait_for_all_tracers
import  utilites.general_utils.exceptions as exceptions 
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langsmith import traceable
from langchain import hub
import json



@traceable(
# TODO: Add ls_provider, ls_model_name
  run_type= "llm",
  metadata={"app": "taklif.ai"},
)
def generate(prompt_params:dict, litellm_call:str): # TODO: select a predefined levels
    try:
        general_assignment = prompt_params.get("general_assignment")
        level = prompt_params.get("level")

        # Prepare the prompt  
        langsmith_prompt = hub.pull(f"{level.lower}-assignment-simplify-prompt")

        # Invoke the LLM
        llm = ChatLiteLLM(model=litellm_call) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input = {"general_assignment": general_assignment})

        # Return the content from the LLM response
        return response

    except Exception as e:
        raise exceptions.GenerateError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()