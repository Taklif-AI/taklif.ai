"use server";

import { RegisterSchema } from "@/lib/schemas/register-schema";
import bcrypt from "bcryptjs";
import { client } from "@/lib/database/dynamo-client";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/utils/tokens";
import { sendVerificationEmail } from "@/lib/utils/mail";
import { promises as dns } from 'dns';

async function hasValidMXRecrod(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}
const TRUSTED_EMAIL_PROVIDERS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "gmx.com",
  "yandex.com",
  "yandex.ru",
];
export async function register(formData: object) {
  const validateData = RegisterSchema.safeParse(formData);

  // validate the user data
  if (!validateData.success) {
    const errors = validateData.error.errors.map((err) => err.message);
    return { error: errors[0] };
  }

  const { email, name, password, confirmPassword } = validateData.data;

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return { error: "Invalid email format!" };
  }

  if (!TRUSTED_EMAIL_PROVIDERS.includes(domain)) {
    return {
      error: "Oops! It looks like we don’t support this email domain. Please try again with a different one.",
    };
  }

  const mxRecordValid = await hasValidMXRecrod(domain);
  if (!mxRecordValid) {
    return { error: 'This email domain appears invalid. Please use a valid email provider.' }
  }
  // check if passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match!" };
  }
  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  // check if the user is exist or not
  const result = await getUserByEmail(email);
  if (result) {
    return { error: "Email already in use!" };
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
      subscription: {
        plan: "free",
        plan_credits: 60,
        remaining_credits: 60,
        subscription_date: new Date().toISOString(),
      },
    },
    ConditionExpression: "attribute_not_exists(pk)",
  };

  // Store the user data in the database
  try {
    await client.send(new PutCommand(insertParams));

    const verificationToken = await generateVerificationToken(email, email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Confirmation email sent!" };
  } catch (error) {
    return { error: "Failed to create an account. Please try again2." };
  }
}
