import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiDBPOST = z
  .object({
    roomId: z
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
  .strict(); // do not allow unrecognized keys

export const schemaApiDBPUT = z
  .object({
    // TODO replace after TEST
    // userId: z.string().uuid()
    userId: z
      .string({
        required_error: "UserId is required",
        invalid_type_error: "Required type for userId is string",
      })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }),
    message: z
      .string()
      .min(1)
      .max(400, { message: "Message exceeds 400 characters" }),
    room: z
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

export const schemaPusherAuthPOST = z
  .object({
    socket_id: z.string({ required_error: "Required socket_id" }),
    channel_name: z.string({ required_error: "Required channel_name" }),
    user_id: z
      .string({ required_error: "Required user_id" })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }), // TODO add .uuid()
  })
  .strict();
