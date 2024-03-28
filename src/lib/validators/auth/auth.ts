import { z } from "zod";

export const schemaApiV1AuthPOST = z
  .object({
    user_id: z
      .string({ required_error: "user_id is required" })
      .uuid({ message: "user_id must be UUIDv4" }),
    user_admin: z.union([
      z
        .string()
        .toLowerCase()
        .transform((x) => x === "true")
        .pipe(z.boolean()),
      z.boolean(),
    ]),
  })
  .strict();
