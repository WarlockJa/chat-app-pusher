import { z } from "zod";
import {
  schemaApiV1dbChannelDELETE,
  schemaApiV1dbChannelPOST,
} from "./channel";

export type TSchemaApiV1dbChannelDELETE = z.infer<
  typeof schemaApiV1dbChannelDELETE
>;

export type TSchemaApiV1dbChannelPOST = z.infer<
  typeof schemaApiV1dbChannelPOST
>;
