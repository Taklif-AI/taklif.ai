import json
import boto3
import os


client = boto3.client("dynamodb")
dynamodb = boto3.resource("dynamodb")

env_name = os.environ.get("ENV_NAME", "Development")
table_name = f"{env_name}-LLMsMetaData"
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    body = {}
    statusCode = 200
    headers = {"Content-Type": "application/json"}

    try:
        # Delete specific model 
        if event["httpMethod"] == "DELETE" and event["pathParameters"] is not None:
            provider = event["pathParameters"]["provider"]
            name = event["pathParameters"]["name"]

            table.delete_item(
                Key={"name": name, "provider": provider}  # Partition key: name, Sort key: provider
            )
            body = f"Deleted model: {name}-{provider}"
        
        # Get specific model
        elif event["httpMethod"] == "GET" and event["pathParameters"] is not None:
            models = table.get_item(
                Key={
                    "name": str(event["pathParameters"]["name"]),
                    "provider": str(event["pathParameters"]["provider"]),
                }
            )
            body = [
                {
                    "name": models["model"]["name"],
                    "provider": models["model"]["provider"],
                    # Here we can add other attributes like: "quality": models["model"]["quality"],
                }
            ]
        
        # Get all models
        elif event["httpMethod"] == "GET" and event["pathParameters"] is None: # list all the models
            models_list = table.scan()
            models = models_list["models"]
            responseBody = []
            for model in models:
                responseItems = [
                    {
                        "name": model["name"],
                        "provider": model["provider"],
                        # Here we can add other attributes like: "quality": models["model"]["quality"],
                    }
                ]
                responseBody.append(responseItems)
            body = responseBody
        
        # Add new model
        elif event["httpMethod"] == "PUT":
            requestJSON = json.loads(event["body"])
            table.put_item(
                Item={
                    "name": requestJSON["name"],
                    "provider": requestJSON["provider"],
                     # Here we can add other attributes like: "quality": models["model"]["quality"],
                }
            )
            name = requestJSON["name"]
            provider = requestJSON["provider"]
            body = f"Added model: {name}-{provider}"
    
    except KeyError:
        statusCode = 400
        body = "Unsupported route: " + event["path"]

    body = json.dumps(body)
    result = {
        "statusCode": statusCode,
        "headers": {"Content-Type": "application/json"},
        "body": body,
    }

    return result