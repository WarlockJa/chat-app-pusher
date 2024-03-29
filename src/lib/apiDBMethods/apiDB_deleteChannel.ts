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
      },
      body: JSON.stringify(body),
    },
    accessToken,
  });
}
