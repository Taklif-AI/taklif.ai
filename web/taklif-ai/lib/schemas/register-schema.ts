import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(20, { message: 'Name must be at most 20 characters.' })
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, {
      message:
        "Name can only contain letters, spaces, apostrophes, hyphens, and periods.",
    }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
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
  confirmPassword: z.string().min(1, {
    message: "Confirm Password is required",
  }),
});
