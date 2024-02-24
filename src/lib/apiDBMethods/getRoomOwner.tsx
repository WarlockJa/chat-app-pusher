import { IChatRoomsSetRoomData } from "@/context/innerContexts/ChatRoomsProvider";
import { TSchemaApiV1dbChannelGET } from "../validators/db/channel/generatedTypes";

export function getRoomOwner({
  params,
  dispatchChatRooms,
}: {
  params: TSchemaApiV1dbChannelGET;
  dispatchChatRooms: (action: IChatRoomsSetRoomData) => void;
}) {
  fetch(`api/v1/db/channel?channel_name=${params.channel_name}`)
    .then((response) => response.json())
    .then((owner: IUserId | undefined) => {
      dispatchChatRooms({
        type: "setRoomData",
        room_id: params.channel_name,
        owner,
        state: "success",
      });
    })
    .catch((error) =>
      dispatchChatRooms({
        type: "setRoomData",
        room_id: params.channel_name,
        state: "error",
      })
    );
}
