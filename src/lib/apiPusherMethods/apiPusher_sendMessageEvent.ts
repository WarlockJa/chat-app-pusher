import { TSchemaApiV1PusherMessagePost } from "../validators/pusher/generatedTypes";

export function apiPusher_sendMessageEvent(
  body: TSchemaApiV1PusherMessagePost
) {
  fetch("/api/v1/pusher/message", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": process.env.NEXT_PUBLIC_API_ACCESS_TOKEN!,
    },
    body: JSON.stringify(body),
  });
}
