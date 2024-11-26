from langchain_core.tracers.langchain import wait_for_all_tracers
from langchain_community.chat_models import ChatLiteLLM
from langchain_core.output_parsers import StrOutputParser
from langchain import hub
import json
import time


def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Extract params from body
        params = body.get('params')
        if not params:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Bad Request: Missing 'params' in the event payload"})
            }
        subject, work_place, course, learning_objective, student_interest, lang_diff_level, logic_diff_level, req_clarity, num_of_words = params

        # Prepare the prompt  
        langsmith_prompt = hub.pull("college-scope-prompt")

        # Invoke the LLM
        model_name = "openrouter/google/palm-2-chat-bison"
        llm = ChatLiteLLM(model=model_name)
        
        simple_chain = langsmith_prompt | llm | StrOutputParser()
        start_time = time.time()

        response = simple_chain.invoke(input = {
                                                "subject": subject,
                                                "work_place": work_place,
                                                "course": course,
                                                "learning_objective":learning_objective ,
                                                 "student_interest": student_interest,
                                                 "lang_diff_level": lang_diff_level,
                                                 "logic_diff_level": logic_diff_level,
                                                 "req_clarity": req_clarity,
                                                 "num_of_words": num_of_words})


        # Return the content from the LLM response
        return {
            "statusCode": 200,
            "body": json.dumps({"response": response}), 
            "executionTime": (time.time() - start_time)
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