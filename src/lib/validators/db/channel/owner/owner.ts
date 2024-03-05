import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1dbChannelOwnerGET = z.object({
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
