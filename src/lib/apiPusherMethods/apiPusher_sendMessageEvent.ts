import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1PusherMessagePost } from "../validators/pusher/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export function apiPusher_sendMessageEvent({
  body,
  accessToken,
}: {
  body: TSchemaApiV1PusherMessagePost;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/pusher/message",
    args: {
      method: "POST",
      headers: {
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
      body: JSON.stringify(body),
    },
    accessToken,
  });

  // TODO delete
  // fetch("/api/v1/pusher/message", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "Application/json",
  //     "pusher-chat-signature": generateSignature({
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     }),
  //   },
  //   body: JSON.stringify(body),
  // });
}
