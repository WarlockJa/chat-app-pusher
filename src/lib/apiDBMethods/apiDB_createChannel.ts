import generateSignature from "@/util/crypto/generateSignature";
import { TSchemaApiV1dbMessagesChannelPOST } from "../validators/db/channel/generatedTypes";

export default function apiDB_createChannel(
  body: TSchemaApiV1dbMessagesChannelPOST
) {
  fetch("/api/v1/db/channel", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": generateSignature({
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      }),
    },
    body: JSON.stringify(body),
  }).catch((error: Error) => {
    throw new Error(error.message);
  });
}
