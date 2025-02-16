"use server";

import { currentUser } from "@/lib/auth/auth";
import { client } from "@/lib/database/dynamo-assignment-client";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

export const fetchAssignment = async (
    run_id: string,
    personalization_id: string,
    simplification_id?: string
) => {

    const user = await currentUser();
    if (!user) {
        return { error: 'Unauthorized' };
    }

    if (!run_id || !personalization_id) {
        return { error: 'Missing parameters' };
    }
    console.log(run_id);
    console.log(personalization_id);

    const PK = user.id;
    let SK;
    if (simplification_id) {
        SK = `RUN#${run_id}#PERSONALIZATION#${personalization_id}#SIMPLIFICATION#${simplification_id}`;
    } else {
        SK = `RUN#${run_id}#PERSONALIZATION#${personalization_id}`;
    }
    try {
        const params = {
            TableName: 'Development-AssignmentsTable',
            Key: { PK, SK }
        }

        const result = await client.send(new GetCommand(params));

        if (!result.Item) {
            return { error: "Assignment not found" };
        }

        return { data: result.Item };
    } catch (error) {
        console.log(error);
        return { error: "Server error!" };
    }

}