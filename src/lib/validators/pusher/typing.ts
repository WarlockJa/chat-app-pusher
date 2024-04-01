import {
  regexAlphanumericWithDash,
  regexStartLetterContainsLettersNumbersUnderscore,
} from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherTypingPost = z.object({
  channel_name: z
    .string({
      required_error: "Channel name is required",
      invalid_type_error: "Required type for channel name is string",
    })
    .startsWith("presence-", {
      message: "Channel name must start with 'presence-'",
    })
    .max(45)
    .regex(regexAlphanumericWithDash, {
      message:
        "Channel name may only contains alphanumerical characters and dash",
    }),
  author: z
    .string({
      required_error: "user_name is required",
      invalid_type_error: "Required type for user_name is string",
    })
    .min(3, {
      message: "user_name must be at least 3 characters long",
    })
    .max(36, { message: "Maximum length for user_name is 36" })
    .regex(regexStartLetterContainsLettersNumbersUnderscore, {
      message:
        "user_name should start with a letter and may contain letters, digits, spaces, underscores, and dashes",
    }),
});
