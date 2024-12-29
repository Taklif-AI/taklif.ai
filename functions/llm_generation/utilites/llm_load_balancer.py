from langchain_community.chat_models import ChatLiteLLMRouter
from litellm import Router
from langchain_core.messages import SystemMessage
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
import os

env_name = os.environ.get("ENV_NAME", "Development")


def send_request(task: str, prompt: str, metadata: dict):
    """Send request to LLM using the litellm router

    Args:
        prompt (str): ready prompt with parameters filled out from the client function
        metadata (dict): required metadata

    Returns:
        response (AIMessage): response of LLM
    """
    model_list = [
        {
            'model_name': item['model_name'], # model alias
            'litellm_params': {
                key: int(value) if isinstance(value, Decimal) else value
                for key, value in item['litellm_params'].items()
            }
        }
        for item in get_model_list(task= task)
    ]
    
    router = setup_router(model_list=model_list)

    chat = ChatLiteLLMRouter(
        router=router,
        model_name="model_1",
    )

    messages = [SystemMessage(content=prompt)]
    response = chat(messages=messages)

    return response


def setup_router(model_list: list):
    """Sets up the router with desired configuration

    Args:
        model_list (list): list of serving LLMs
        routing_strategy (str): desired routing strategy

    Returns:
        router (litellm.Router): Router object balances the load between LLMs
    """
    
    model_names = [item['model_name'] for item in model_list]

    enable_pre_call_checks = True    # check before calling on two things: deployment.context_window < message, deployments outside of region
    allowed_fails = 1                # cooldown model if it fails > 1 call in a minute.
    cooldown_time = 100              # cooldown the deployment for 100 seconds if it num_fails > allowed_fails
    num_retries = 3                  # number of retries for failed requests.
    retry_after = 5                  # waits min 5s before retrying request
    fallbacks = [{model: [m for m in model_names if m != model]} for model in model_names] # define fallbacks for each model

    router = Router(
        model_list=model_list,
        routing_strategy="usage-based-routing-v2",
        fallbacks=fallbacks,
        enable_pre_call_checks=enable_pre_call_checks,
        allowed_fails=allowed_fails,
        cooldown_time=cooldown_time,
        num_retries=num_retries,
        retry_after=retry_after,
    )

    return router


def get_model_list(task: str):
    """Returns the list of serving LLMs

    Returns:
        models: models list
    """
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(f"{env_name}-ServingLLMs")
    
    models_list = table.scan(FilterExpression=Key('task').eq(task))
    models = models_list["Items"]

    return models
