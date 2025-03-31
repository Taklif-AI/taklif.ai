import { z } from "zod";
// Regex for checking that the string contains only letters (no numbers or special chars)
const lettersOnly = /^[A-Za-z\s]+$/;

export const assignmentSchema = z.object({
  student_interest:
    z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string()
        .min(3, { message: "Interest must be at least 3 characters" })
        .max(40, { message: "Interest must be at most 35 characters" })
        .regex(lettersOnly, { message: "Interest can only contain letters, (no numbers, or symbols)" }),
    )

});
