import { regexAlphanumericWithDash } from "@/util/regExes";
import { z } from "zod";

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
