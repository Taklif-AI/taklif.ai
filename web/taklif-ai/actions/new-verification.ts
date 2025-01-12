"use server";

import { getUserByEmail, updateUserDynamicData, updateUserFields } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { client } from '@/lib/database/dynamo-client';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";


export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(`VR#${token}`);

    if (!existingToken) {
        return { error: "Token does not exist!" }
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const hasExpired = existingToken.expires < currentTime;

    if (hasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.old_email);

    if (!existingUser) {
        return { error: "Email does not exist!" }
    }

    await updateUserDynamicData(existingUser.pk,
        {
            emailVerified: new Date().toISOString(),
            email: existingToken.email,
            GSI1PK: `USER#${existingToken.email}`,
            GSI1SK: `USER#${existingToken.email}`,
        },
    );
    await client.send(new DeleteCommand({
        TableName: 'next-auth',
        Key: {
            pk: existingToken.pk,
            sk: existingToken.sk,
        },
        ConditionExpression: "attribute_exists(pk)",
    }))

    return { success: "Email verified!" };
}