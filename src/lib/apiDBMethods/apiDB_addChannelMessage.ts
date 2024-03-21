import { TSchemaApiV1dbMessagesNewPOST } from "../validators/db/messages/generatedTypes";

// adding message to the messages array at channel collection in DB
export function apiDB_addChannelMessage(body: TSchemaApiV1dbMessagesNewPOST) {
  fetch("/api/v1/db/messages/new", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": process.env.NEXT_PUBLIC_API_ACCESS_TOKEN!,
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    // TODO test error handling
    .catch((error: Error) => {
      throw new Error(error.message);
    });
}
