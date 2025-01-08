import { client } from '@/lib/database/dynamo-client';
import { QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";


export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :email",
            ExpressionAttributeValues: {
                ":email": `PR#${email}`,
            },
            Limit: 1
        };
        const result = await client.send(new QueryCommand(params));
        if (result.Items && result.Items.length > 0) {
            return result.Items[0];
        }
    } catch (error) {
        return null;
    }
}


export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            Key: {
                pk: token,
                sk: token,
            }
        };
        const result = await client.send(new GetCommand(params));
        if (result.Item) {
            return result.Item;
        }
    } catch (error) {
        return null;
    }
}