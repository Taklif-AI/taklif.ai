import * as z from "zod";

export const ResetSchema = z.object({
  email:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().email({
        message: "Email is required",
      }),
    )
});
