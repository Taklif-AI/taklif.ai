'use server';

import { signIn } from "@/auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "@/lib/schemas/login-schema";
import {
    sendVerificationEmail,
    sendTwoFactorTokenEmail
} from "@/lib/utils/mail";
import {
    generateVerificationToken,
    generateTwoFactorToken
} from "@/lib/utils/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { client } from '@/lib/database/dynamo-client';
import { PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { v4 as uuidv4 } from "uuid";


export async function login(formData: object) {

    const validateData = LoginSchema.safeParse(formData);

    if (!validateData.success) {
        const errors = validateData.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }

    const { email, password, code } = validateData.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Email does not exist!' }
    }


    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(
            existingUser.email
        );

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: 'Confirmation email sent!' };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if (!twoFactorToken) {
                return { error: "Invalid code!" }
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" }
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const hasExpired = twoFactorToken.expires < currentTime;

            if (hasExpired) {
                return { error: "Code expired!" }
            }

            await client.send(new DeleteCommand({
                TableName: 'next-auth',
                Key: {
                    pk: twoFactorToken.pk,
                    sk: twoFactorToken.sk,
                },
                ConditionExpression: "attribute_exists(pk)",
            }));

            const exisitingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.pk);
            if (exisitingConfirmation) {
                await client.send(new DeleteCommand({
                    TableName: 'next-auth',
                    Key: {
                        pk: exisitingConfirmation.pk,
                        sk: exisitingConfirmation.sk,
                    },
                    ConditionExpression: "attribute_exists(pk)",
                }));
            }
            const twoFactorConfirmationId = uuidv4();
            const towFactorConfirmation = {
                pk: `TFC#${twoFactorConfirmationId}`,
                sk: `TFC#${twoFactorConfirmationId}`,
                GSI1PK: existingUser.pk,
                GSI1SK: existingUser.sk,
            };
            const parmas = {
                TableName: 'next-auth',
                Item: towFactorConfirmation,
                ConditionExpression: "attribute_not_exists(pk)",
            };

            try {
                await client.send(new PutCommand(parmas));
            } catch (error) {
                console.error("Error inserting item:", error);
                throw error;
            }

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            );

            return { twoFactor: true };
        }

    }
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: 'Something went wrong!' }
            }
        }
        throw error;
    }
}