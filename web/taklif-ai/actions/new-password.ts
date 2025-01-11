"use server";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail, updateOneUserField } from "@/data/user";
import { NewPasswordSchema } from "@/lib/schemas/new-password-schema";
import bcrypt from 'bcrypt';
import { client } from '@/lib/database/dynamo-client';
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";


export const newPassword = async (
    formData: object,
    token?: string | null
) => {

    if (!token) {
        return { error: 'Missing token!' }
    }

    const validateData = NewPasswordSchema.safeParse(formData);

    // validate the user data
    if (!validateData.success) {
        const errors = validateData.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }

    const { password, confirmPassword } = validateData.data;

    // check if passwords match
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match!' };
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingToken = await getPasswordResetTokenByToken(`PR#${token}`);

    if (!existingToken) {
        return { error: 'Invalid token!' }
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const hasExpired = existingToken.expires < currentTime;

    if (hasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Email does not exist!" }
    }
    await updateOneUserField(existingUser.pk, 'password', hashedPassword);
    await client.send(new DeleteCommand({
        TableName: 'next-auth',
        Key: {
            pk: existingToken.pk,
            sk: existingToken.sk,
        },
        ConditionExpression: "attribute_exists(pk)",
    }))

    return { success: "Password updated!" };
}