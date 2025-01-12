import { client } from '@/lib/database/dynamo-client';
import { QueryCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

type UpdateRequest = {
    user_id: string;
    updates: Record<string, any>;
};

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

export const updateOneUserField = async (id: string, field: string, value) => {
    try {
        const params = {
            TableName: 'next-auth',
            Key: {
                pk: id,
                sk: id,
            },
            UpdateExpression: `SET #field = :value`,
            ExpressionAttributeNames: {
                '#field': field,
            },
            ExpressionAttributeValues: {
                ':value': value,
            },

        };

        await client.send(new UpdateCommand(params));
    } catch (error) {
        return null;
    }
}

export const updateUserDynamicData = async (user_id: string, updates: object) => {
    try {
        const updateExpression: string[] = [];
        const expressionAttributeValues: Record<string, any> = {};
        const expressionAttributeNames: Record<string, string> = {};

        Object.keys(updates).forEach((key) => {
            updateExpression.push(`#${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = updates[key];
            expressionAttributeNames[`#${key}`] = key;
        });

        const params = {
            TableName: 'next-auth',
            Key: {
                pk: user_id,
                sk: user_id,
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        }
        await client.send(new UpdateCommand(params));

    } catch (error) {
        return null;
    }
}