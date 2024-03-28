import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import { TSchemaApiV1dbChannelDELETE } from "../validators/db/channel/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export default function apiDB_deleteChannel({
  body,
  accessToken,
}: {
  body: TSchemaApiV1dbChannelDELETE;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/db/channel",
    args: {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json",
        // TODO delete
        // "pusher-chat-signature": generateSignature({
        //   key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        // }),
      },
      body: JSON.stringify(body),
    },
    accessToken,
  });

  // TODO delete
  // fetch("/api/v1/db/channel", {
  //   method: "DELETE",
  //   headers: {
  //     "Content-Type": "Application/json",
  //     "pusher-chat-signature": generateSignature({
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     }),
  //   },
  //   body: JSON.stringify(body),
  // }).catch((error: Error) => {
  //   throw new Error(error.message);
  // });
}
