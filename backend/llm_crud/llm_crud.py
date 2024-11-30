import json
import boto3

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('LLMs') 

def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }

    try:
        if event['httpMethod'] == "DELETE" and event['pathParameters'] is not None :
            table.delete_item(
                Key={'name': str(event['pathParameters']['name'])})
            body = 'Deleted item ' + str(event['pathParameters']['name'])
        elif event['httpMethod'] == "GET" and event['pathParameters'] is not None :
            body = table.get_item(
                Key={'name': str(event['pathParameters']['name'])})
            body = body["Item"]
            responseBody = [
                {'name': body['name'], 'quality': body['quality']}]
            body = responseBody
        elif event['httpMethod'] == "GET"  and event['pathParameters'] is None:
            body = table.scan()
            body = body["Items"]
            print("ITEMS----")
            print(body)
            responseBody = []
            for items in body:
                responseItems = [
                    {'name': items['name'], 'quality': items['quality']}]
                responseBody.append(responseItems)
            body = responseBody
        elif event['httpMethod'] == "PUT":
            requestJSON = json.loads(event['body'])
            table.put_item(
                Item={
                    # 'id': requestJSON['id'],
                    'name': requestJSON['name'],
                    'quality': requestJSON['quality']
                })
            body = 'Put item ' + requestJSON['name']
    except KeyError:
        statusCode = 400
        body = 'Unsupported route: ' + event['path']
    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": body
    }
    return res