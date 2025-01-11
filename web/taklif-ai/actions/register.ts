'use server';

import { RegisterSchema } from "@/lib/schemas/register-schema";
import bcrypt from "bcrypt";
import { client } from '@/lib/database/dynamo-client';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/utils/tokens";
import { sendVerificationEmail } from "@/lib/utils/mail";


export async function register(formData: object) {

    const validateData = RegisterSchema.safeParse(formData);

    // validate the user data
    if (!validateData.success) {
        const errors = validateData.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }

    const { email, name, password, confirmPassword } = validateData.data;

    // check if passwords match
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match!' };
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if the user is exist or not
    const result = await getUserByEmail(email);
    if (result) {
        return { error: 'Email already in use!' }
    }

    const user_id = uuidv4();
    const insertParams = {
        TableName: "next-auth",
        Item: {
            pk: `USER#${user_id}`,
            sk: `USER#${user_id}`,
            GSI1PK: `USER#${email}`,
            GSI1SK: `USER#${email}`,
            name: name,
            email: email,
            password: hashedPassword,
            isTwoFactorEnabled: false,
            createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(pk)",
    };

    // Store the user data in the database
    try {
        await client.send(new PutCommand(insertParams));

        const verificationToken = await generateVerificationToken(email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: "Confirmation email sent!" };
    } catch (error) {
        return { error: "Failed to create an account. Please try again2." };
    }
}