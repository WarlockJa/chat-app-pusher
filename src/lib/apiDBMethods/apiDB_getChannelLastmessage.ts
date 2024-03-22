import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import generateSignature from "@/util/crypto/generateSignature";

export default function apiDB_getChannelLastmessage({
  owner,
  dispatchChatRooms,
}: {
  owner: string;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
}) {
  const channel_name = `presence-${owner}`;
  fetch(`api/v1/db/channel/lastmessage?channel_name=${channel_name}`, {
    method: "GET",
    headers: {
      "pusher-chat-signature": generateSignature({
        key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
      }),
    },
  })
    .then((response) => response.json())
    .then((result: string | null) => {
      dispatchChatRooms({
        type: "ChatRooms_updateLastmessage",
        roomName: channel_name,
        lastmessage: result,
      });
    });
}
