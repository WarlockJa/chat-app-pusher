import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherMessagePost = z.object({
  message_id: z
    .string({
      required_error: "Message ID required",
    })
    .uuid({ message: "Message ID must be UUIDv4" }),
  message: z
    .string()
    .min(1)
    .max(400, { message: "Message exceeds 400 characters" }),
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
    .string({ required_error: "Author is required" })
    .uuid({ message: "Author must be UUIDv4" }),
});
