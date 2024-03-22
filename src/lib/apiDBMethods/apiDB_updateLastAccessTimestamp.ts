import generateSignature from "@/util/crypto/generateSignature";
import { TSchemaApiV1dbMessagesLastaccessPOST } from "../validators/db/messages/generatedTypes";

// updates user timestamp at lastaccess array for channel collection in DB
// TODO make route channel instead of messages PUT
export function apiDB_updateLastaccessTimestamp(
  body: TSchemaApiV1dbMessagesLastaccessPOST
) {
  fetch("/api/v1/db/messages/lastaccess", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": generateSignature({
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      }),
    },
    body: JSON.stringify(body),
  });
}
