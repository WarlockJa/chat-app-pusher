import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherTypingPost = z.object({
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
  // TODO add .uuid()
  author: z
    .string({
      required_error: "UserId is required",
      invalid_type_error: "Required type for userId is string",
    })
    .max(36, { message: "Maximum length for userId is 36" })
    .regex(regexAlphanumericWithDash, {
      message: "UserId may only contains alphanumerical characters and dash",
    }),
});
