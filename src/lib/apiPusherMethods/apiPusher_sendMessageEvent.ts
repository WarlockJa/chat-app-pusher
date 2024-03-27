import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1PusherMessagePost } from "../validators/pusher/generatedTypes";

export function apiPusher_sendMessageEvent(
  body: TSchemaApiV1PusherMessagePost
) {
  fetch("/api/v1/pusher/message", {
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
