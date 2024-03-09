import { IChatRoomsSetRoomData } from "@/context/innerContexts/ChatRoomsProvider";

export function getRoomOwner({
  dispatchChatRooms,
}: {
  dispatchChatRooms: (action: IChatRoomsSetRoomData) => void;
}) {
  fetch(`api/v1/db/channel`)
    .then((response) => response.json())
    .then((channels: IUserId | undefined) => {
        // TODO add all channels to room data
    //   dispatchChatRooms({
    //     type: "setRoomData",
    //     room_id: params.channel_name,
    //     owner,
    //     state: "success",
    //   });
    })
    .catch((error) =>
    //   dispatchChatRooms({
    //     type: "setRoomData",
    //     room_id: params.channel_name,
    //     state: "error",
    //   })
    )
}
