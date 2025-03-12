import * as z from "zod";

export const NewPasswordSchema = z.object({
  password:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, {
          message: "Password must include at least one uppercase letter",
        })
        .regex(/[a-z]/, {
          message: "Password must include at least one lowercase letter",
        })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[@$!%*?&]/, {
          message:
            "Password must include at least one special character (@, $, !, %, *, ?, &)",
        }),
    ),

  confirmPassword:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(1, {
        message: "Confirm Password is required",
      }),
    )
});
