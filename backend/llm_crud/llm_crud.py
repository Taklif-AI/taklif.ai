import json
import boto3

client = boto3.client("dynamodb")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("LLMs")


def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200
    headers = {"Content-Type": "application/json"}

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
            body = f"Put item: {prrequestJSON["name"]}-{prrequestJSON["provider"]}"
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