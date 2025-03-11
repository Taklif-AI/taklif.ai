import * as z from "zod";

export const SettingsSchema = z.object({
  isTwoFactorEnabled: z.optional(z.boolean()),
  password: z.optional(z.string()),
  newPassword: z.optional(
    z
      .string()
      .min(8, { message: "New password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "New password must include at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "New password must include at least one lowercase letter",
      })
      .regex(/\d/, { message: "New password must include at least one number" })
      .regex(/[@$!%*?&]/, {
        message:
          "New password must include at least one special character (@, $, !, %, *, ?, &)",
      }),
  ),
});
