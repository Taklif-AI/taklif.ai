"use server";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "@/lib/database/dynamo-assignment-client";


export async function getAssignments(userId: string, limit: number = 1, ExclusiveStartKey: any = null) {
    const params = {
        TableName: "Development-AssignmentsTable",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": `${userId}`,
        },
        ProjectionExpression: "SK, created_at, model_output, simplification_id",
        ScanIndexForward: false,
        Limit: limit,
    };

    if (ExclusiveStartKey) {
        params.ExclusiveStartKey = ExclusiveStartKey;
    }

    try {
        const { Items, LastEvaluatedKey } = await client.send(new QueryCommand(params));

        if (!Items || Items.length === 0) {
            return { assignments: [], lastEvaluatedKey: null };
        }

        // Filter assignments where `simplification_id` is NULL
        const assignments = Items.filter((item) => !item.simplification_id);

        if (assignments.length === 0) {
            return { assignments: [], lastEvaluatedKey: null };
        }

        const processedAssignments = assignments.map((assignment) => {
            return {
                runId: assignment.SK.split("#")[1], // Extract run_id
                personalizationId: assignment.SK.split("#")[3], // Extract personalization_id
                title: assignment.model_output?.title || "Untitled Assignment",
                text: assignment.model_output?.content || "No content available",
                createdAt: assignment.created_at,
            };
        });

        // Sort processed assignments in DESCENDING order
        processedAssignments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return { assignments: processedAssignments, lastEvaluatedKey: LastEvaluatedKey || null };
    } catch (error) {
        console.error("❌ Error fetching assignments:", error);
        return { assignments: [], lastEvaluatedKey: null };
    }
}
