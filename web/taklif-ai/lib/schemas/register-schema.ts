import * as z from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must include at least one special character (@, $, !, %, *, ?, &)" }),
    confirmPassword: z.string(),
    name: z.string().min(1, {
        message: "Name is required"
    }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })