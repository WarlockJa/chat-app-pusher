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
      },
      body: JSON.stringify(body),
    },
    accessToken,
  });
}
