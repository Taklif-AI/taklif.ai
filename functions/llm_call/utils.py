from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
from langsmith import traceable

@traceable(
     # TODO: Add ls_provider, ls_model_name
  run_type= "llm",
  metadata={"app": "taklif.ai"},
)
def generate(prompt_params:dict, model_name):
      # Prepare the prompt  
    langsmith_prompt = hub.pull("personalize-assignment-prompt")

    # Invoke the LLM
    llm = ChatLiteLLM(model=model_name) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
    
    simple_chain = langsmith_prompt | llm | StrOutputParser()

    response = simple_chain.invoke(prompt_params)
    return response


