import { TSchemaApiV1dbMessagesLastaccessPOST } from "../validators/db/messages/generatedTypes";

// updates user timestamp at lastaccess array for channel collection in DB
// TODO make route channel instead of messages PUT
export function apiDB_updateLastaccessTimestamp(
  body: TSchemaApiV1dbMessagesLastaccessPOST
) {
  fetch("/api/v1/db/messages/lastaccess", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
