import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1dbChannelDELETE } from "../validators/db/channel/generatedTypes";

export default function apiDB_deleteChannel(body: TSchemaApiV1dbChannelDELETE) {
  fetch("/api/v1/db/channel", {
    method: "DELETE",
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
