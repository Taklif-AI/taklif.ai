'use server';

import { signIn } from "@/auth";
import { LoginSchema } from "@/lib/schemas/login-schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";


export async function login(formData: object) {

    const validateData = LoginSchema.safeParse(formData);

    if (!validateData.success) {
        const errors = validateData.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }

    const { email, password } = validateData.data;

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