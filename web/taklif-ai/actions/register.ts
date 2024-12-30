'use server';

import { RegisterSchema } from "@/lib/schemas/register-schema";
export async function register(formData: object) {

    const validateData = RegisterSchema.safeParse(formData);

    if (!validateData.success) {
        return { error: "Invalid fields!" };
    }
    console.log(validateData.data);

    return { success: "Logged in successfully!" };
}