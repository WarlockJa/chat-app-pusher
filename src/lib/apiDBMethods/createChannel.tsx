import { TSchemaApiV1dbMessagesChannelPOST } from "../validators/db/channel/generatedTypes";

export default function createChannel(body: TSchemaApiV1dbMessagesChannelPOST) {
  fetch("/api/v1/db/channel", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  }).catch((error: Error) => {
    throw new Error(error.message);
  });
}
