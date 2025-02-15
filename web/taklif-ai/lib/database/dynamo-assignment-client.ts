import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";


const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.ASSIGNMENT_DYNAMOD_ID as string,
        secretAccessKey: process.env.ASSIGNMENT_DYNAMOD_SECRET as string,
    },
    region: process.env.ASSIGNMENT_DYNAMOD_REGION,
}

export const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})