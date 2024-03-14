import { z } from "zod";
import { schemaApiV1dbMessagesLastaccessPOST } from "./lastaccess";
import {
  schemaApiV1dbMessagesNewGET,
  schemaApiV1dbMessagesNewPOST,
} from "./new";
import { schemaApiV1dbMessagesHistoryGET } from "./history";

export type TSchemaApiV1dbMessagesLastaccessPOST = z.infer<
  typeof schemaApiV1dbMessagesLastaccessPOST
>;

export type TSchemaApiV1dbMessagesNewGET = z.infer<
  typeof schemaApiV1dbMessagesNewGET
>;

export type TSchemaApiV1dbMessagesNewPOST = z.infer<
  typeof schemaApiV1dbMessagesNewPOST
>;

export type TSchemaApiV1dbMessagesHistoryGET = z.infer<
  typeof schemaApiV1dbMessagesHistoryGET
>;
