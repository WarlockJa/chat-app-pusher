import { TSchemaApiV1dbChannelPOST } from "../validators/db/channel/generatedTypes";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export default function apiDB_createChannel({
  body,
  accessToken,
}: {
  body: TSchemaApiV1dbChannelPOST;
  accessToken: IAccessToken;
}) {
  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: "/api/v1/db/channel",
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
