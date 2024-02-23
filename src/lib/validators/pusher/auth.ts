import {
  regexAlphanumericWithDash,
  regexStartLetterContainsLettersNumbersUnderscore,
} from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherAuthPOST = z
  .object({
    socket_id: z.string({ required_error: "Required socket_id" }),
    channel_name: z.string({ required_error: "Required channel_name" }),
    user_id: z
      .string({ required_error: "Required user_id" })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }), // TODO add .uuid()
    user_admin: z
      .any()
      .transform((val) => {
        const value = JSON.parse(val);
        return typeof value === "boolean" ? value : false;
      })
      .pipe(z.boolean()),
    // TODO add proper validation
    user_name: z
      .string({
        required_error: "user_id is required",
        invalid_type_error: "Required type for user_id is string",
      })
      .min(3, {
        message: "user_name must be at least 3 characters long",
      })
      .max(36, { message: "Maximum length for user_id is 36" })
      .regex(regexStartLetterContainsLettersNumbersUnderscore, {
        message:
          "user_name should start with a letter and may contain letters, digits, spaces, underscores, and dashes",
      }),
  })
  .strict();
