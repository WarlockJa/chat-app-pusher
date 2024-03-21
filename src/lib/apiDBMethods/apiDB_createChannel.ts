import { TSchemaApiV1dbMessagesChannelPOST } from "../validators/db/channel/generatedTypes";

export default function apiDB_createChannel(
  body: TSchemaApiV1dbMessagesChannelPOST
) {
  fetch("/api/v1/db/channel", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": process.env.NEXT_PUBLIC_API_ACCESS_TOKEN!,
    },
    body: JSON.stringify(body),
  }).catch((error: Error) => {
    throw new Error(error.message);
  });
}
