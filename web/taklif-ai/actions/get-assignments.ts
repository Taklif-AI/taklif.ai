"use server";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "@/lib/database/dynamo-assignment-client";

export async function getAssignments(
  userId: string,
  lastEvaluatedKey = null,
  limit: number = 2
) {
  const params: any = {
    TableName: "Development-AssignmentsTable",
    KeyConditionExpression: "PK = :pk",
    FilterExpression: "size(simplification_id) = :zero",
    ExpressionAttributeValues: {
      ":pk": userId,
      ":zero": 0,
    },
    ProjectionExpression: "SK, created_at, model_output, simplification_id",
    ScanIndexForward: false,
    Limit: limit,
  };

  if (lastEvaluatedKey) {
    params.ExclusiveStartKey = lastEvaluatedKey;
  }

  try {
    const { Items, LastEvaluatedKey } = await client.send(
      new QueryCommand(params)
    );

    if (!Items || Items.length === 0) {
      return { assignments: [], lastEvaluatedKey: null };
    }

    const processedAssignments = Items.map((assignment) => ({
      runId: assignment.SK.split("#")[1],
      personalizationId: assignment.SK.split("#")[3],
      title: assignment.model_output?.title || "Untitled Assignment",
      text: assignment.model_output?.content || "No content available",
      createdAt: assignment.created_at,
    }));

    // Sort processed assignments in DESCENDING order
    processedAssignments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      assignments: processedAssignments,
      lastEvaluatedKey: LastEvaluatedKey || null,
    };
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    return { assignments: [], lastEvaluatedKey: null };
  }
}
