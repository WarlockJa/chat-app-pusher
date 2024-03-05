import { z } from "zod";
import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelGET,
  schemaApiV1dbChannelPOST,
} from "./channel";

export type TSchemaApiV1dbChannelGET = z.infer<typeof schemaApiV1dbChannelGET>;

export type TSchemaApiV1dbChannelDELETE = z.infer<
  typeof schemaApiV1dbChannelDELETE
>;

export type TSchemaApiV1dbMessagesChannelPOST = z.infer<
  typeof schemaApiV1dbChannelPOST
>;
