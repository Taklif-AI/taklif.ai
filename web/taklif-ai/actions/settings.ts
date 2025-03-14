"use server";

import { getUserById, updateUserDynamicData } from "@/data/user";
import { currentUser } from "@/lib/auth/auth";
import { SettingsSchema } from "@/lib/schemas/settings-schema";
import { unstable_update } from "@/auth";
import bcrypt from "bcryptjs";
import { PasswordsSchema } from "@/lib/schemas/change-password-schema";

export const settings = async (formData) => {
  const data = {};
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (!user.isOAuth) {
    const validatedIsTwoFactorEnabled = SettingsSchema.safeParse({
      isTwoFactorEnabled: formData.isTwoFactorEnabled,
    });

    if (!validatedIsTwoFactorEnabled.success) {
      const errors = validatedIsTwoFactorEnabled.error.errors.map(
        (err) => err.message,
      );
      return { error: errors[0] };
    }

    const { isTwoFactorEnabled } = validatedIsTwoFactorEnabled.data;
    data.isTwoFactorEnabled = isTwoFactorEnabled;
    
    if (isTwoFactorEnabled === true || isTwoFactorEnabled === false) {
      await unstable_update({
        user: {
          isTwoFactorEnabled: isTwoFactorEnabled,
          theme: formData.theme,
        },
      });
    }
  }

  const allowedTheme = ["dark", "light"];
  if (formData.theme) {
    if (!allowedTheme.includes(formData.theme)) {
      return { error: "Unallowd theme value!" };
    }
    data.theme = formData.theme;
  }
  await updateUserDynamicData(dbUser.pk, data);

  if (formData.theme) {
    await unstable_update({
      user: {
        theme: formData.theme,
      },
    });
  }

  return { success: "Settings updated!" };
};
