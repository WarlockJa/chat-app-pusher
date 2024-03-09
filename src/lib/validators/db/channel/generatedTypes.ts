import { z } from "zod";
import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelPOST,
} from "./channel";

export type TSchemaApiV1dbChannelDELETE = z.infer<
  typeof schemaApiV1dbChannelDELETE
>;

export type TSchemaApiV1dbMessagesChannelPOST = z.infer<
  typeof schemaApiV1dbChannelPOST
>;
