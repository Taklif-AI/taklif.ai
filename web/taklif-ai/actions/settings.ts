"use server";

import { getUserById, updateUserDynamicData } from '@/data/user';
import { currentUser } from '@/lib/auth/auth';
import { SettingsSchema } from '@/lib/schemas/settings-schema';
import { unstable_update } from '@/auth';
import bcrypt from 'bcryptjs';

export const settings = async (formData) => {
    const data = {};
    const user = await currentUser();

    if (!user) {
        return { error: 'Unauthorized' };
    }

    if (user.isOAuth) {
        formData.password = undefined;
        formData.newPassword = undefined;
        formData.isTwoFactorEnabled = undefined;
        return { error: 'Unallowed to modify!' };
    }

    const dbUser = await getUserById(user.id as string);
    if (!dbUser) {
        return { error: 'Unauthorized' };
    }


    if (formData.password && !formData.newPassword) {
        return { error: ' New password is required!' }
    }

    if (formData.newPassword && !formData.password) {
        return { error: 'Password is required!' }
    }


    if (formData.password && formData.newPassword && dbUser.password) {
        console.log(formData);
        const validateData = SettingsSchema.safeParse({ password: formData.password, newPassword: formData.newPassword });

        if (!validateData.success) {
            const errors = validateData.error.errors.map((err) => err.message)

            return { error: errors[0] };
        }
        const { password, newPassword } = validateData.data;
        const passwordsMatch = await bcrypt.compare(
            password as string,
            dbUser.password
        );
        if (!passwordsMatch) {
            return { error: 'Incorrect password' };
        }

        const hashedPassword = await bcrypt.hash(newPassword as string, 10);
        data.password = hashedPassword;

    }

    const validatedIsTwoFactorEnabled = SettingsSchema.safeParse({ isTwoFactorEnabled: formData.isTwoFactorEnabled });
    if (!validatedIsTwoFactorEnabled.success) {
        const errors = validatedIsTwoFactorEnabled.error.errors.map((err) => err.message)
        return { error: errors[0] };
    }
    const { isTwoFactorEnabled } = validatedIsTwoFactorEnabled.data;
    data.isTwoFactorEnabled = isTwoFactorEnabled;


    await updateUserDynamicData(dbUser.pk, data);

    if (isTwoFactorEnabled === true || isTwoFactorEnabled === false) {
        await unstable_update({
            user: {
                isTwoFactorEnabled: isTwoFactorEnabled
            }
        })
    }


    return { success: 'Settings updated!' }
}