import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbMessagesHistoryGET = z
  .object({
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
        required_error: "Limit of messages to return required",
        invalid_type_error: "Must be a number",
      })
      .nullable(),
  })
  .strict();
// TODO delete
// export const schemaApiV1dbMessagesHistoryGET = z
//   .object({
//     // TODO replace after TEST
//     // userId: z.string().uuid()
//     user_id: z
//       .string({
//         required_error: "UserId is required",
//         invalid_type_error: "Required type for userId is string",
//       })
//       .max(36, { message: "Maximum length for userId is 36" })
//       .regex(regexAlphanumericWithDash, {
//         message: "UserId may only contains alphanumerical characters and dash",
//       }),
//     channel_name: z
//       .string({
//         required_error: "Channel name is required",
//         invalid_type_error: "Required type for channel name is string",
//       })
//       .startsWith("presence-", {
//         message: "Channel name must start with 'presence-'",
//       })
//       .max(45)
//       .regex(regexAlphanumericWithDash, {
//         message: "UserId may only contains alphanumerical characters and dash",
//       }),
//     limit: z.number({
//       required_error: "Limit of messages to return required",
//       invalid_type_error: "Must be a number",
//     }),
//     skip: z.union([z.number(), z.nan()]),
//   })
//   .strict();

export const schemaApiV1dbMessagesHistoryPOST = z
  .object({
    message_id: z
      .string({
        required_error: "Message ID required",
      })
      .uuid({ message: "Message ID must be UUIDv4" }),
    // TODO replace after TEST
    // userId: z.string().uuid()
    user_id: z
      .string({
        required_error: "UserId is required",
        invalid_type_error: "Required type for userId is string",
      })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
    message_text: z
      .string()
      .min(1)
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
  })
  .strict();
