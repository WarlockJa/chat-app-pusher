import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1PusherTypingPost } from "../validators/pusher/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export function apiPusher_sendTypingEvent({
  body,
  accessToken,
}: {
  body: TSchemaApiV1PusherTypingPost;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/pusher/typing",
    args: {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
      body: JSON.stringify(body),
    },
    accessToken,
  });

  // TODO delete
  // fetch("/api/v1/pusher/typing", {
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
