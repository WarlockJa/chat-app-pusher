import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1dbMessagesLastaccessPOST } from "../validators/db/messages/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

// updates user timestamp at lastaccess array for channel collection in DB
// TODO make route channel instead of messages PUT
export function apiDB_updateLastaccessTimestamp({
  body,
  accessToken,
}: {
  body: TSchemaApiV1dbMessagesLastaccessPOST;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/db/messages/lastaccess",
    args: {
      method: "POST",
      // TODO delete
      // headers: {
      //   "pusher-chat-signature": generateSignature({
      //     key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      //   }),
      // },
      body: JSON.stringify(body),
    },
    accessToken,
  });

  // TODO delete
  // fetch("/api/v1/db/messages/lastaccess", {
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
