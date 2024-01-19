import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

export const schemaApiV1PusherMessagePost = z.object({
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
      message: "UserId may only contains alphanumerical characters and dash",
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

export const schemaApiV1dbGET = z
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

export const schemaApiV1dbPOST = z
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

export const schemaApiV1dbPUT = z
  .object({
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

export const schemaApiV1PusherAuthPOST = z
  .object({
    socket_id: z.string({ required_error: "Required socket_id" }),
    channel_name: z.string({ required_error: "Required channel_name" }),
    user_id: z
      .string({ required_error: "Required user_id" })
      .max(36, { message: "Maximum length for userId is 36" })
      .regex(regexAlphanumericWithDash, {
        message: "UserId may only contains alphanumerical characters and dash",
      }), // TODO add .uuid()
    user_admin: z
      .string()
      .toLowerCase()
      .transform((val) => {
        const value = JSON.parse(val);
        return typeof value === "boolean" ? value : false;
      })
      .pipe(z.boolean()),
    // TODO add proper validation
    user_name: z.string(),
  })
  .strict();
