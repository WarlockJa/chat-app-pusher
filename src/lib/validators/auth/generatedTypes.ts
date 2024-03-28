import { z } from "zod";
import { schemaApiV1AuthPOST } from "./auth";

export type TSchemaApiV1AuthPost = z.infer<typeof schemaApiV1AuthPOST>;
