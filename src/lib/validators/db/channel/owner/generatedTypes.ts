import { z } from "zod";
import { schemaApiV1dbChannelOwnerGET } from "./owner";

export type TSchemaApiV1dbChannelOwnerGET = z.infer<
  typeof schemaApiV1dbChannelOwnerGET
>;
