"use server";

import { getUserById, updateUserDynamicData } from "@/data/user";
import { currentUser } from "@/lib/auth/auth";
import bcrypt from "bcryptjs";
import { PasswordsSchema } from "@/lib/schemas/change-password-schema";

export const changePassword = async (formData) => {
  const data = {};
  const user = await currentUser();

  if (!user) {
    return { passError: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);
  if (!dbUser) {
    return { passError: "Unauthorized" };
  }

  if (!user.isOAuth) {

    if (formData.password && !formData.newPassword) {
      return { passError: " New password is required!" };
    }

    if (formData.newPassword && !formData.password) {
      return { passError: "Password is required!" };
    }

    const validateData = PasswordsSchema.safeParse({
      password: formData.password,
      newPassword: formData.newPassword,
    });

    if (!validateData.success) {
      const errors = validateData.error.errors.map((err) => err.message);

      return { passError: errors[0] };
    }

    if (formData.password && formData.newPassword && dbUser.password) {
      const { password, newPassword } = validateData.data;
      const passwordsMatch = await bcrypt.compare(
        password as string,
        dbUser.password,
      );
      if (!passwordsMatch) {
        return { passError: "Incorrect password" };
      }

      const hashedPassword = await bcrypt.hash(newPassword as string, 10);
      data.password = hashedPassword;
    }
  }


  await updateUserDynamicData(dbUser.pk, data);

  return { success: "Password updated!" };
};
