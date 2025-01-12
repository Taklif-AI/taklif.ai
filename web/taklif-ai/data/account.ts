import { client } from '@/lib/database/dynamo-client';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getAccountByUserId = async (pk: string) => {
    try {
        const params = {
            TableName: 'next-auth',
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':pk': pk,
                ':userId': pk.split('#')[1],
            },

        }
        const result = await client.send(new QueryCommand(params));
        if (result.Items && result.Items.length > 0) {
            return result.Items[0];
        }
    } catch (error) {
        return null;
    }

}