import { client } from '@/lib/database/dynamo-client';
import { QueryCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const getUserByEmail = async (email: string) => {
    try {
        const params = {
            TableName: "next-auth",
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :email",
            ExpressionAttributeValues: {
                ":email": `USER#${email}`,
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

export const getUserById = async (id: string) => {
    try {
        const params = {
            TableName: "next-auth",
            Key: {
                pk: id,
                sk: id,
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

export const updateUserFields = async (id: string, field1: string, value1, field2: string, value2) => {
    try {
        const params = {
            TableName: 'next-auth',
            Key: {
                pk: id,
                sk: id,
            },
            UpdateExpression: `SET #field1 = :value1, #field2 = :value2`,
            ExpressionAttributeNames: {
                '#field1': field1,
                '#field2': field2,
            },
            ExpressionAttributeValues: {
                ':value1': value1,
                ':value2': value2,
            },

        };

        await client.send(new UpdateCommand(params));
    } catch (error) {
        return null;
    }
}