import { IChatRoomsSetRoomData } from "@/context/innerContexts/ChatRoomsProvider";
import { TSchemaApiV1dbChannelOwnerGET } from "../validators/db/channel/owner/generatedTypes";

export function getRoomOwner({
  params,
  dispatchChatRooms,
}: {
  params: TSchemaApiV1dbChannelOwnerGET;
  dispatchChatRooms: (action: IChatRoomsSetRoomData) => void;
}) {
  fetch(`api/v1/db/channel/owner?channel_name=${params.channel_name}`)
    .then((response) => response.json())
    .then((owner: IUserId | undefined) => {
      if (owner?.user_id) {
        dispatchChatRooms({
          type: "setRoomData",
          room_id: params.channel_name,
          owner,
          state: "success",
        });
      }
    })
    .catch((error) =>
      dispatchChatRooms({
        type: "setRoomData",
        room_id: params.channel_name,
        state: "error",
      })
    );
}
