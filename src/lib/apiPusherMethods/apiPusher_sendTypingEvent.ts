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
      body: JSON.stringify(body),
    },
    accessToken,
  });
}
