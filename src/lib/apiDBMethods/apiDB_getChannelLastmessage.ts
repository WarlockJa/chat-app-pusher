import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
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
    args: {
      method: "GET",
      headers: {
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
    },
    accessToken,
    callback,
  });

  // TODO delete
  // fetch(`api/v1/db/channel/lastmessage?channel_name=${channel_name}`, {
  //   method: "GET",
  //   headers: {
  //     "pusher-chat-signature": generateSignature({
  //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //     }),
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((result: string | null) => {
  //     dispatchChatRooms({
  //       type: "ChatRooms_updateLastmessage",
  //       roomName: channel_name,
  //       lastmessage: result,
  //     });
  //   });
}
