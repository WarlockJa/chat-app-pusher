import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbMessagesNewGET = z
  .object({
    user_id: z
      .string({ required_error: "user_id is required" })
      .uuid({ message: "user_id must be UUIDv4" }),
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
  })
  .strict();

export const schemaApiV1dbMessagesNewPOST = z.object({
  message_id: z
    .string({
      required_error: "Message ID required",
    })
    .uuid({ message: "Message ID must be UUIDv4" }),
  author: z
    .string({ required_error: "author is required" })
    .uuid({ message: "author must be UUIDv4" }),
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
