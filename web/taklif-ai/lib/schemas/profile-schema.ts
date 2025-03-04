import * as z from "zod";

export const ProfileSchema = z.object({
  name: z.optional(z.string().min(1, { message: "Name cannot be empty!" })),
  email: z.optional(z.string().email()),
  institution: z.optional(z.string()),
});
