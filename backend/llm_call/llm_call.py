from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.tracers.langchain import wait_for_all_tracers
import json
import os

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Extract 'query' from the body
        query = body.get('query', [])
        
        if not query:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Bad Request: Missing 'query' in the event payload"})
            }

        # Invoke the LLM        
        prompt_template = "'{query}'" # TBD
        
        prompt = PromptTemplate(input_variables=["query"], template=prompt_template)
        
        model_name = "openrouter/google/palm-2-chat-bison"
        llm = ChatLiteLLM(model=model_name)
        simple_chain = prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input=query)

        # Return the content from the LLM response
        return {
            "statusCode": 200,
            "body": json.dumps({"response": response})
        }
    
    except Exception as e:
        # Handle exceptions and return an error message
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error: " + str(e)})
        }
    # wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()