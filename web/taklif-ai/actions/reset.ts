"use server";

import { ResetSchema } from "@/lib/schemas/reset-schema";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/utils/tokens";
import { sendPasswordResetEmail } from "@/lib/utils/mail";

export async function reset(formData: object) {

    const validateData = ResetSchema.safeParse(formData);

    if (!validateData.success) {

        return { error: 'Invalid email!' };
    }

    const { email } = validateData.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Email not found!" }
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    );
    return { success: 'Reset email sent!' };
}