import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";


const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.AUTH_DYNAMODB_ID as string,
        secretAccessKey: process.env.AUTH_DYNAMODB_SECRET as string,
    },
    region: process.env.AUTH_DYNAMODB_REGION,
}

export const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})