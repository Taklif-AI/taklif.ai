from langchain_core.tracers.langchain import wait_for_all_tracers
from utilites.custom_exceptions import GenerationError
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langsmith import traceable
import json


@traceable(
    name="Simplify",
    run_type= "llm",
    metadata={"app": "taklif.ai"},
)
def simplify(prompt_params:dict, metadata: dict):
    try:
        personalized_assignment = prompt_params.get("personalized_assignment")
        interest = prompt_params.get("interest")

        # Prepare the prompt  
        langsmith_prompt = metadata['langsmith_client'].pull_prompt(prompt_identifier = "simplify-assignment-prompt")

        # Invoke the LLM
        llm = ChatLiteLLM(model=metadata['litellm_call']) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input = {"assignment" : personalized_assignment, "interest" : interest})

        # Return the content from the LLM response
        return response

    except Exception as e:
        raise GenerationError(f"Internal Server Error: {str(e)}")

    # Wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()
