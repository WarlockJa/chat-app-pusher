import { z } from "zod";
import { schemaApiV1AuthPOST } from "./auth";

export type TSchemaApiV1AuthPost = z.infer<typeof schemaApiV1AuthPOST>;
export type TSchemaApiV1AuthPostOmitSignature = Omit<
  z.infer<typeof schemaApiV1AuthPOST>,
  "signature"
>;
