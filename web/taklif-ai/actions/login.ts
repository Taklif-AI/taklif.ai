'use server';
import { LoginSchema } from "@/lib/schemas/login-schema";
export async function login(formData: object) {

    const validateData = LoginSchema.safeParse(formData);

    if (!validateData.success) {
        return { error: "Invalid fields!" }; 
    }

    return { success: "Logged in successfully!" };
}