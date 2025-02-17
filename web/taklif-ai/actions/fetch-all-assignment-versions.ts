"use server";

import { currentUser } from "@/lib/auth/auth";
import { client } from "@/lib/database/dynamo-assignment-client";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const fetchAllAssignmentVersions = async (
    run_id: string,
    // personalization_id: string,
) => {

    const user = await currentUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    if (!run_id) {
        return { error: 'Missing parameters' };
    }

    const PK = user.id;
    const SKPrefix = `RUN#${run_id}`;

    try {
        const params = {
            TableName: 'Development-AssignmentsTable',
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk_prefix)',
            ExpressionAttributeValues: {
                ':pk': PK,
                ':sk_prefix': SKPrefix,
            },
        }

        const result = await client.send(new QueryCommand(params));

        if (!result.Items || result.Items.length === 0) {
            return { error: "No assignments found for this run" };
        }

        return { data: result.Items };
    } catch (error) {
        console.log(error);
        return { error: "Server error!" };
    }

}