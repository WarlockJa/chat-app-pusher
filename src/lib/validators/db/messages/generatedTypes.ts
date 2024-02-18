import { z } from "zod";
import { schemaApiV1dbMessagesLastaccessPOST } from "./lastaccess";
import { schemaApiV1dbMessagesNewGET } from "./new";
import {
  schemaApiV1dbMessagesHistoryGET,
  schemaApiV1dbMessagesHistoryPOST,
} from "./history";

export type TSchemaApiV1dbMessagesLastaccessPOST = z.infer<
  typeof schemaApiV1dbMessagesLastaccessPOST
>;

export type TSchemaApiV1dbMessagesNewGET = z.infer<
  typeof schemaApiV1dbMessagesNewGET
>;

export type TSchemaApiV1dbMessagesHistoryPOST = z.infer<
  typeof schemaApiV1dbMessagesHistoryPOST
>;

export type TSchemaApiV1dbMessagesHistoryGET = z.infer<
  typeof schemaApiV1dbMessagesHistoryGET
>;
