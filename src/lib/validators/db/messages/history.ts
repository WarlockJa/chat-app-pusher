import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbMessagesHistoryGET = z.object({
  message_id: z
    .string({
      required_error: "Message ID required",
    })
    .uuid({ message: "Message ID must be UUIDv4" })
    .nullable(),
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
      message: "UserId may only contains alphanumerical characters and dash",
    }),
  limit: z
    .number({
      // required_error: "Limit of messages to return required",
      invalid_type_error: "Must be a number",
    })
    .nullable(),
});

export const schemaApiV1dbMessagesHistoryPOST = z.object({
  message_id: z
    .string({
      required_error: "Message ID required",
    })
    .uuid({ message: "Message ID must be UUIDv4" }),
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
  message_text: z
    .string()
    .min(1, { message: "Message must be at least 1 character long" })
    .max(400, { message: "Message exceeds 400 characters" }),
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
