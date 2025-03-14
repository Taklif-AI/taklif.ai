import * as z from "zod";

export const SettingsSchema = z.object({
  isTwoFactorEnabled: z.optional(z.boolean()),
});
