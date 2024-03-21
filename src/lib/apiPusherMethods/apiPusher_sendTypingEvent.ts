import { TSchemaApiV1PusherTypingPost } from "../validators/pusher/generatedTypes";

export function apiPusher_sendTypingEvent(body: TSchemaApiV1PusherTypingPost) {
  fetch("/api/v1/pusher/typing", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
      "pusher-chat-signature": process.env.NEXT_PUBLIC_API_ACCESS_TOKEN!,
    },
    body: JSON.stringify(body),
  });
}
