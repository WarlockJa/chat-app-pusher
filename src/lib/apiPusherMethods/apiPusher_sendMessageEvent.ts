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
      body: JSON.stringify(body),
    },
    accessToken,
  });
}
