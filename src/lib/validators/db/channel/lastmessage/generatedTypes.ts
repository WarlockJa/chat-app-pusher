import { z } from "zod";
import { schemaApiV1dbChannelLastmessageGET } from "./lastmessage";

export type TSchemaApiV1dbChannelLastmessageGET = z.infer<
  typeof schemaApiV1dbChannelLastmessageGET
>;
