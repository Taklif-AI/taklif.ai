import { client } from '@/lib/database/dynamo-client';
import { PutCommand, QueryCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


export const createVerificationToken = async (item: object) => {
    const parmas = {
        TableName: 'next-auth',
        Item: item,
        ConditionExpression: "attribute_not_exists(pk)",
    };
    try {
        await client.send(new PutCommand(parmas));
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            IndexName: "GSI1",
            KeyConditionExpression: "GSI1PK = :email",
            ExpressionAttributeValues: {
                ":email": `VR#${email}`,
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

export const getVerificationTokenByToken = async (token: string) => {
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

export const deleteVerificationToken = async (pk: string, sk: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            Key: {
                pk: pk,
                sk: sk,
            }
        }
        await client.send(new DeleteCommand(params));
    } catch (error) {
        return null
    }
}