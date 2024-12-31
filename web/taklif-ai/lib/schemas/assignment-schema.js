import { z } from 'zod';
// Regex for checking that the string contains only letters (no numbers or special chars)
const lettersOnly = /^[A-Za-z ]+$/;

export const assignmentSchema = z.object({

    student_interest: z.string()
        .min(3, { message: "Interest must be at least 3 characters" })
        .max(20, { message: "Interest must be at most 20 characters" })
        .regex(lettersOnly, { message: "Interest can only contain letters" }),

    // lang_diff_level: z.enum(["easy", "medium", "hard",], {
    //     message: "Difficulty level must be one of the following: easy, medium, hard"
    // }),

    // num_of_words: z.number()
    //     .min(100, { message: "Number of words must be at least 100" })
    //     .max(1000, { message: "Number of words must be at most 1000" })
    //     .int({ message: "Number of words must be an integer" }),
});
