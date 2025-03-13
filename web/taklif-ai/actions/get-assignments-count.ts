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
    ProjectionExpression: "SK, is_first_try",
    ScanIndexForward: false,
  };

  try {
    const { Items } = await client.send(new QueryCommand(params));

    if (!Items || Items.length === 0) {
      return 0;
    }

    // Filter assignments where `is_first_try` is true
    const assignments = Items.filter((item) => item.is_first_try === true);

    return assignments.length;
  } catch (error) {
    console.error("❌ Error fetching assignments:", error);
    return 0;
  }
}
