import {
  regexAlphanumericWithDash,
  regexStartLetterContainsLettersNumbersUnderscore,
} from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbMessagesChannelPOST = z.object({
  // TODO replace after TEST
  // userId: z.string().uuid()
  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "Required type for user_id is string",
    })
    .max(36, { message: "Maximum length for user_id is 36" })
    .regex(regexAlphanumericWithDash, {
      message: "user_id must be uuidv4",
    }),
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
  user_admin: z
    .any()
    .transform((val) => {
      const value = JSON.parse(val);
      return typeof value === "boolean" ? value : false;
    })
    .pipe(z.boolean()),
  channel_name: z
    .string({
      required_error: "ActiveRoom is required",
      invalid_type_error: "Required type for activeRoom is string",
    })
    .startsWith("presence-", {
      message: "ActiveRoom must start with 'presence-'",
    })
    .max(45)
    .regex(regexAlphanumericWithDash, {
      message: "UserId may only contains alphanumerical characters and dash",
    }),
});
