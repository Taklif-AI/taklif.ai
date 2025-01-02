'use server';

import { RegisterSchema } from "@/lib/schemas/register-schema";
import bcrypt from "bcrypt";
import { client } from '@/lib/database/dynamo-client';
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";


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

    const checkParams = {
        TableName: "next-auth",
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :email",
        ExpressionAttributeValues: {
            ":email": `USER#${email}`,
        },
        Limit: 1
    };

    // check if the user is exist or not
    try {
        const result = await client.send(new QueryCommand(checkParams));
        if (result.Items && result.Items.length > 0) {
            console.log(result.Items);
            return { error: "Email already in use!" };
        }
    } catch (error) {
        console.log(error);
        return { error: "Failed to create an account. Please try again." };
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
            createdAt: new Date().toISOString(),
        },
        ConditionExpression: "attribute_not_exists(pk)",
    };

    // Store the user data in the database
    try {
        await client.send(new PutCommand(insertParams));
        return { success: "User created!" };

        // TODO: Send Verification token email
    } catch (error) {
        return { error: "Failed to create an account. Please try again2." };
    }
}