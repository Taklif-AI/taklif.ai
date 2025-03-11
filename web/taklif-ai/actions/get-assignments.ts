"use server";

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { client } from "@/lib/database/dynamo-assignment-client";

export async function getAssignments(
  userId: string,
) {
  const params: any = {
    TableName: "Development-AssignmentsTable",
    KeyConditionExpression: "PK = :pk",
    FilterExpression: "is_first_try = :true",
    ExpressionAttributeValues: {
      ":pk": userId,
      ":true": true,
    },
    ProjectionExpression: "SK, created_at, model_output, is_first_try",
    ScanIndexForward: false,
  };


  try {
    const { Items } = await client.send(new QueryCommand(params),);

    if (!Items || Items.length === 0) {
      return { assignments: [] };
    }

    const processedAssignments = Items.map((assignment) => ({
      runId: assignment.SK.split("#")[1],
      personalizationId: assignment.SK.split("#")[3],
      title: assignment.model_output?.title || "Untitled Assignment",
      text: assignment.model_output?.content || "No content available",
      createdAt: assignment.created_at,
    }));

    // Sort assignments in descending order (most recent first)
    processedAssignments.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );


    return { assignments: processedAssignments };
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    return { assignments: [] };
  }
}
