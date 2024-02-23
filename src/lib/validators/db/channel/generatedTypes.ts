import { z } from "zod";
import { schemaApiV1dbMessagesChannelPOST } from "./channel";

export type TSchemaApiV1dbMessagesChannelPOST = z.infer<
  typeof schemaApiV1dbMessagesChannelPOST
>;
