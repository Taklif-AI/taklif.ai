"use server";

import { ProfileSchema } from '@/lib/schemas/profile-schema';
import { getUserByEmail, getUserById, updateUserDynamicData } from '@/data/user';
import { currentUser } from '@/lib/auth/auth';
import { generateVerificationToken } from '@/lib/utils/tokens';
import { sendVerificationEmail } from '@/lib/utils/mail';
import { unstable_update } from '@/auth';

export const profile = async (formData: object) => {
    const data = {};
    const user = await currentUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) {
        return { error: 'Unauthorized' };
    }

    if (user.isOAuth) {
        formData.email = undefined;
    }

    const validateData = ProfileSchema.safeParse(formData);
    if (!validateData.success) {
        const errors = validateData.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }
    const { name, email, institution } = validateData.data;

    if (name) {
        data.name = name;
    }

    if (institution) {
        data.institution = institution;
    }

    if (email && email !== user.email) {
        const existingUser = await getUserByEmail(email);

        if (existingUser && existingUser.pk !== user.id) {
            return { error: 'Email already in use!' }
        }

        const verificationToken = await generateVerificationToken(email, user.email as string);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return { success: 'Verification email sent!' }
    }

    await updateUserDynamicData(dbUser.pk, data);

    if (name) {
        await unstable_update({
            user: {
                name: name,
            }
        })
    }
    if (institution) {
        await unstable_update({
            user: {
                institution: institution
            }
        })
    }
    if (email) {
        await unstable_update({
            user: {
                email: email
            }
        })
    }
    return { success: "Profile updated" }

}