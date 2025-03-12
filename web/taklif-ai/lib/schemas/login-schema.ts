import * as z from "zod";

export const LoginSchema = z.object({
  email:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().email({
        message: "Email is required",
      }),
    ),

  password:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(1, { message: "Password is required" }),
    ),
  code:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.optional(z.string()),
    )
});
