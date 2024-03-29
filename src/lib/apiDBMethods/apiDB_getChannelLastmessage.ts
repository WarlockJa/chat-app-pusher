import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

export default function apiDB_getChannelLastmessage({
  owner,
  dispatchChatRooms,
  accessToken,
}: {
  owner: string;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  accessToken: IAccessToken;
}) {
  const channel_name = `presence-${owner}`;

  const callback = (result: string | null) => {
    dispatchChatRooms({
      type: "ChatRooms_updateLastmessage",
      roomName: channel_name,
      lastmessage: result,
    });
  };

  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: `api/v1/db/channel/lastmessage?channel_name=${channel_name}`,
    accessToken,
    callback,
  });
}
