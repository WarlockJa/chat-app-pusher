import { TSchemaApiV1PusherTypingPost } from "../validators/pusher/generatedTypes";

export function sendTypingEvent(body: TSchemaApiV1PusherTypingPost) {
  fetch("/api/v1/pusher/typing", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  });
}
