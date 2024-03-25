import { regexStartLetterContainsLettersNumbersUnderscore } from "@/util/regExes";
import { z } from "zod";

export const schemaChatProps = z
  .object({
    user_id: z
      .string({
        required_error: "user_id is required",
      })
      .uuid({
        message: "user_id must be of type UUIDv4",
      }),
    user_admin: z.union([
      z
        .string()
        .toLowerCase()
        .transform((x) => x === "true")
        .pipe(z.boolean()),
      z.boolean(),
    ]),
    user_name: z
      .string({
        required_error: "user_name is required",
        invalid_type_error: "Required type for user_name is string",
      })
      .min(3, {
        message: "user_name must be at least 3 characters long",
      })
      .max(36, { message: "Maximum length for user_name is 36 characters" })
      .regex(regexStartLetterContainsLettersNumbersUnderscore, {
        message:
          "user_name should start with a letter and may contain letters, digits, spaces, underscores, and dashes",
      }),
  })
  .strict();
