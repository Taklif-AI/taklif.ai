from langchain_core.tracers.langchain import wait_for_all_tracers
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
import json


def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))

        # Extract model from body
        model_name = body.get("model")
        if not model_name:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Bad Request: Missing 'model' in the event payload"})
            }
        
        # Extract params from body
        params = body.get('params')
        if not params:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Bad Request: Missing 'params' in the event payload"})
            }
        
        subject = params.get("subject")
        work_place = params.get("work_place")
        course = params.get("course")
        learning_objective = params.get("learning_objective")
        student_interest = params.get("student_interest")
        lang_diff_level = params.get("lang_diff_level")
        logic_diff_level = params.get("logic_diff_level")
        req_clarity = params.get("req_clarity")
        num_of_words = params.get("num_of_words")

        # Prepare the prompt  
        langsmith_prompt = hub.pull("college-scope-prompt")

        # Invoke the LLM
        llm = ChatLiteLLM(model=model_name) # example model name: "openrouter/meta-llama/llama-3.2-3b-instruct:free"
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()

        response = simple_chain.invoke(input = {
                                                "subject": subject,
                                                "work_place": work_place,
                                                "course": course,
                                                "learning_objective":learning_objective,
                                                "student_interest": student_interest,
                                                "lang_diff_level": lang_diff_level,
                                                "logic_diff_level": logic_diff_level,
                                                "req_clarity": req_clarity,
                                                "num_of_words": num_of_words})


        # Return the content from the LLM response
        return {
            "statusCode": 200,
            "body": json.dumps({"response": response})
        }
    
    except Exception as e:
        # Handle exceptions and return an error message
        return {
            "statusCode": 500,
            "body": json.dumps({"error": "Internal Server Error: " + str(e)}),
        }

    # Wait for langsmith tracer to finish    
    finally:
        wait_for_all_tracers()