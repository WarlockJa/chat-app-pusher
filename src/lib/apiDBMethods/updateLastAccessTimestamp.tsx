import { z } from "zod";
import { schemaApiV1dbMessagesLastaccessPOST } from "../validators/db/lastaccess";

// inferring api endpoints expected types from zod models
type TSchemaDBMessagesLastaccessPOST = z.infer<
  typeof schemaApiV1dbMessagesLastaccessPOST
>;

// updates user timestamp at lastaccess array for channel collection in DB
export function updateLastAccessTimestamp(
  body: TSchemaDBMessagesLastaccessPOST
) {
  fetch("/api/v1/db/messages/lastaccess", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
