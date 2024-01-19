import { z } from "zod";
import { schemaApiV1PusherMessagePost } from "./validators";

type TSchemaPusherMessagePost = z.infer<typeof schemaApiV1PusherMessagePost>;
export function sendMessageEvent(body: TSchemaPusherMessagePost) {
  fetch("/api/v1/pusher/message", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  });
}
