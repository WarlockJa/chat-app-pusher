import { TSchemaApiV1dbMessagesLastaccessPOST } from "../validators/db/messages/generatedTypes";

// updates user timestamp at lastaccess array for channel collection in DB
export function updateLastAccessTimestamp(
  body: TSchemaApiV1dbMessagesLastaccessPOST
) {
  fetch("/api/v1/db/messages/lastaccess", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
