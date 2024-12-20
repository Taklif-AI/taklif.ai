from langchain_core.tracers.langchain import wait_for_all_tracers
from utilites.custom_exceptions import GenerateError
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langsmith import traceable
import json



@traceable(
# TODO: Add ls_provider, ls_model_name
  run_type= "llm",
  metadata={"app": "taklif.ai"},
)
def generate(prompt_params:dict, metadata: dict): # TODO: select a predefined levels
    try:
        general_assignment = prompt_params.get("general_assignment")
        level = prompt_params.get("level")

        # Prepare the prompt  
        langsmith_prompt = metadata['langsmith_client'].pull_prompt( prompt_identifier = f"{level.lower}-assignment-simplify-prompt")

        # Invoke the LLM
        llm = ChatLiteLLM(model=metadata['litellm_call']) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input = {"general_assignment": general_assignment})

        # Return the content from the LLM response
        return response

    except Exception as e:
        raise GenerateError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()
