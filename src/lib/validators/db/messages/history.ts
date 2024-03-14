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
      invalid_type_error: "Must be a number",
    })
    .nullable(),
});
