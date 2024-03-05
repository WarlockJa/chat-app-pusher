import { TSchemaApiV1dbMessagesHistoryPOST } from "../validators/db/messages/generatedTypes";

// adding message to the messages array at channel collection in DB
export function addChannelMessage(body: TSchemaApiV1dbMessagesHistoryPOST) {
  fetch("/api/v1/db/messages/history", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    // TODO test error handling
    .catch((error: Error) => {
      throw new Error(error.message);
    });
}
