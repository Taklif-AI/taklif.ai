import json
import boto3
import os

client = boto3.client("dynamodb")
dynamodb = boto3.resource("dynamodb")


env_name = os.environ.get("ENV_NAME", "Development")
table_name = f"{env_name}-LLMs"
table = dynamodb.Table(table_name)


def lambda_handler(event, context):
    body = {}
    statusCode = 200
    headers = {"Content-Type": "application/json"}

    return table
    try:
        if event["httpMethod"] == "DELETE" and event["pathParameters"] is not None:
            provider = event["pathParameters"]["provider"]
            name = event["pathParameters"]["name"]

            table.delete_item(
                Key={"name": name, "provider": provider}  # Partition key  # Sort key
            )
            body = f"Deleted item: {name}-{provider}"
        elif event["httpMethod"] == "GET" and event["pathParameters"] is not None:
            body = table.get_item(
                Key={
                    "name": str(event["pathParameters"]["name"]),
                    "provider": str(event["pathParameters"]["provider"]),
                }
            )
            body = [
                {
                    "name": body["Item"]["name"],
                    "provider": body["Item"]["provider"],
                    "quality": body["Item"]["quality"],
                }
            ]
        elif event["httpMethod"] == "GET" and event["pathParameters"] is None:
            body = table.scan()
            body = body["Items"]
            responseBody = []
            for items in body:
                responseItems = [
                    {
                        "name": items["name"],
                        "provider": items["provider"],
                        "quality": items["quality"],
                    }
                ]
                responseBody.append(responseItems)
            body = responseBody
        elif event["httpMethod"] == "PUT":
            requestJSON = json.loads(event["body"])
            table.put_item(
                Item={
                    "name": requestJSON["name"],
                    "provider": requestJSON["provider"],
                    "quality": requestJSON["quality"],
                }
            )
            name = requestJSON["name"]
            provider = requestJSON["provider"]
            body = f"Put item: {name}-{provider}"
    except KeyError:
        statusCode = 400
        body = "Unsupported route: " + event["path"]

    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": {"Content-Type": "application/json"},
        "body": body,
    }

    return res