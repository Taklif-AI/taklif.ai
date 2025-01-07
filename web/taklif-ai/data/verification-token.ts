import { client } from '@/lib/database/dynamo-client';
import { QueryCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


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

export const deleteVerificationToken = async (pk: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            Key: {
                pk: pk,
                sk: pk,
            }
        }
        await client.send(new DeleteCommand(params));
        console.log("Item successfully deleted!");
    } catch (error) {
        return null
    }
}