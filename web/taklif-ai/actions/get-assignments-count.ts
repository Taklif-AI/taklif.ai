"use server";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "@/lib/database/dynamo-assignment-client";

export async function getAssignmentsCount(userId: string) {
    const params = {
        TableName: "Development-AssignmentsTable",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": `${userId}`,
        },
        ProjectionExpression: "SK, created_at, model_output, simplification_id",
        ScanIndexForward: false,
    };

    try {
        const { Items } = await client.send(new QueryCommand(params));

        if (!Items || Items.length === 0) {
            return [];
        }

        // Filter assignments where `simplification_id` is NULL
        const assignments = Items.filter((item) => !item.simplification_id);

        if (assignments.length === 0) {
            return [];
        }

        return assignments;
    } catch (error) {
        console.error("❌ Error fetching assignments:", error);
        return [];
    }
}
