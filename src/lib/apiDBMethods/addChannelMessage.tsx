import { z } from "zod";
import { schemaApiV1dbMessagesHistoryPOST } from "../validators/db/history";

// inferring api endpoints expected types from zod models
type TSchemaDBMessagesHistoryPOST = z.infer<
  typeof schemaApiV1dbMessagesHistoryPOST
>;

// adding message to the messages array at channel collection in DB
export function addChannelMessage(body: TSchemaDBMessagesHistoryPOST) {
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
