import * as z from "zod";

export const ProfileSchema = z.object({
  name: z.optional(
    z.string()
      .min(2, { message: "Name must be at least 2 characters." })
      .max(20, { message: 'Name must be at most 20 characters.' })
      .regex(/^[\p{L}\p{M}\s.'-]+$/u, {
        message:
          "Name can only contain letters, spaces, apostrophes, hyphens, and periods.",
      })),
  email: z.optional(z.string().email()),
  institution: z.optional(
    z.string()
      .min(2, { message: "Institution name must be at least 2 characters." })
      .max(100, { message: "Institution name must be at most 100 characters." })
      .regex(/^[\p{L}\p{M}\p{N}\s,.'&()-]+$/u, {
        message:
          "Institution name can only contain letters, numbers, spaces, commas, periods, apostrophes, hyphens, parentheses, and ampersands.",
      })
  ),
});
