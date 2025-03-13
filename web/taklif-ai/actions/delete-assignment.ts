"use server";

import { currentUser } from "@/lib/auth/auth";
import { client } from "@/lib/database/dynamo-assignment-client";
import { QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


export async function deleteAssignment(run_id: string) {

    console.log('in action');

    const user = await currentUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    if (!run_id) {
        return { error: "Missing parameters" };
    }

    const PK = user.id;
    const SKPrefix = `RUN#${run_id}`;
    const params = {
        TableName: "Development-AssignmentsTable",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk_prefix)",
        ExpressionAttributeValues: {
            ":pk": PK,
            ":sk_prefix": SKPrefix,
        },
    }

    try {
        const result = await client.send(new QueryCommand(params));
        const items = result.Items;
        if (!items || items.length === 0) {
            return { error: 'No assignments found.' };
        }
        console.log(items.length);

        for (const item of items) {
            const deleteParams = {
                TableName: "Development-AssignmentsTable",
                Key: {
                    PK: item.PK,
                    SK: item.SK,
                }
            }
            await client.send(new DeleteCommand(deleteParams));
        }
        return { success: true }
    } catch (error) {
        console.log(error);
        return { error: 'Unable to delete assignment.' };
    }
}