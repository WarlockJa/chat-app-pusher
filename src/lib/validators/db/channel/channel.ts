import {
  regexAlphanumericWithDash,
  regexStartLetterContainsLettersNumbersUnderscore,
} from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbChannelGET = z.object({
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

export const schemaApiV1dbChannelDELETE = z.object({
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

export const schemaApiV1dbChannelPOST = z.object({
  user_id: z
    .string({ required_error: "user_id is required" })
    .uuid({ message: "user_id must be UUIDv4" }),
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
  user_admin: z.coerce.boolean(),
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
