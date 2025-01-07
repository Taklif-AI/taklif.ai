import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { v4 as uuidv4 } from "uuid";
import { client } from '@/lib/database/dynamo-client';
import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";


export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const expires = now + 3600; // expire the token in 1hour

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await client.send(new DeleteCommand({
            TableName: 'next-auth',
            Key: {
                pk: existingToken.pk,
                sk: existingToken.sk,
            },
            ConditionExpression: "attribute_exists(pk)",
        }))
    }

    // Create a new password reset token record in the database
    const passwordResetToken = {
        pk: `PR#${token}`,
        sk: `PR#${token}`,
        GSI1PK: `PR#${email}`,
        GSI1SK: `PR#${email}`,
        email: email,
        token: token,
        expires: expires
    };

    const parmas = {
        TableName: 'next-auth',
        Item: passwordResetToken,
        ConditionExpression: "attribute_not_exists(pk)",
    };
    try {
        await client.send(new PutCommand(parmas));
        return passwordResetToken;
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    }
}


export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const expires = now + 3600; // expire the token in 1hour

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await client.send(new DeleteCommand({
            TableName: 'next-auth',
            Key: {
                pk: existingToken.pk,
                sk: existingToken.sk,
            },
            ConditionExpression: "attribute_exists(pk)",
        }))
    }

    // Create a new verification token record in the database
    const verificationToken = {
        pk: `VR#${token}`,
        sk: `VR#${token}`,
        GSI1PK: `VR#${email}`,
        GSI1SK: `VR#${email}`,
        email: email,
        token: token,
        expires: expires
    };

    const parmas = {
        TableName: 'next-auth',
        Item: verificationToken,
        ConditionExpression: "attribute_not_exists(pk)",
    };
    try {
        await client.send(new PutCommand(parmas));
        return verificationToken;
    } catch (error) {
        console.error("Error inserting item:", error);
        throw error;
    }
}