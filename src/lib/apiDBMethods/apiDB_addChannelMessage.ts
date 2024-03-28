import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1dbMessagesNewPOST } from "../validators/db/messages/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

// adding message to the messages array at channel collection in DB
export function apiDB_addChannelMessage({
  body,
  accessToken,
}: {
  body: TSchemaApiV1dbMessagesNewPOST;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/db/messages/new",
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
  // fetch("/api/v1/db/messages/new", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "Application/json",
  //     "pusher-chat-signature": generateSignature({
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     }),
  //   },
  //   body: JSON.stringify(body),
  // })
  //   .then((response) => response.json())
  //   // TODO test error handling
  //   .catch((error: Error) => {
  //     throw new Error(error.message);
  //   });
}
