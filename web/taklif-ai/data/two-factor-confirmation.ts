import { client } from '@/lib/database/dynamo-client';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

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