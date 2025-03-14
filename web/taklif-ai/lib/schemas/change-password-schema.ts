import * as z from "zod";

export const PasswordsSchema = z.object({
  password:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string()
        .min(1, { message: "Password is required!" })
    ),
  newPassword:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string()
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
