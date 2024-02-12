import { TSchemaApiV1PusherMessagePost } from "../validators/pusher/generatedTypes";

export function sendMessageEvent(body: TSchemaApiV1PusherMessagePost) {
  fetch("/api/v1/pusher/message", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  });
}
