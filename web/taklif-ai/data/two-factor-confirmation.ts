import { client } from '@/lib/database/dynamo-client';
import { PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


export const createTwoFactorConfirmation = async (item: object) => {
    try {
        const parmas = {
            TableName: 'next-auth',
            Item: item,
            ConditionExpression: "attribute_not_exists(pk)",
        };
        await client.send(new PutCommand(parmas));
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    }
}
export const getTwoFactorConfirmationByUserId = async (
    userId: string
) => {
    try {
        const params = {
            TableName: 'next-auth',
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
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

export const deleteTwoFactorConfirmation = async (pk: string, sk: string) => {
    try {
        await client.send(new DeleteCommand({
            TableName: 'next-auth',
            Key: {
                pk: pk,
                sk: sk,
            },
            ConditionExpression: "attribute_exists(pk)",
        }));
    } catch (error) {
        return null;
    }
}