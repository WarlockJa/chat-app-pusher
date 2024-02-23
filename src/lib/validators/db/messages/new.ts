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
