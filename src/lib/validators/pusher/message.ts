import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherMessagePost = z.object({
  id: z
    .string({
      required_error: "Message ID required",
    })
    .uuid({ message: "Message ID must be UUIDv4" }),
  message: z
    .string()
    .min(1)
    .max(400, { message: "Message exceeds 400 characters" }),
  activeRoom: z
    .string({
      required_error: "ActiveRoom is required",
      invalid_type_error: "Required type for activeRoom is string",
    })
    .startsWith("presence-", {
      message: "ActiveRoom must start with 'presence-'",
    })
    .max(45)
    .regex(regexAlphanumericWithDash, {
      message:
        "Channel name may only contains alphanumerical characters and dash",
    }),
  author: z
    .string({ required_error: "user_id is required" })
    .uuid({ message: "user_id must be UUIDv4" }),
});
