import { IChatRoomsAddNewRoom } from "@/context/innerContexts/ChatRoomsProvider";

export function getChannels({
  dispatchChatRooms,
}: {
  dispatchChatRooms: (action: IChatRoomsAddNewRoom) => void;
}) {
  fetch(`api/v1/db/channel`)
    .then((response) => response.json())
    .then((channels: { name: string; owner: IUserId }[]) => {
      // TODO add all channels to room data
      channels.map((channel) => {
        dispatchChatRooms({
          type: "addNewRoom",
          room_id: channel.name,
          owner: channel.owner,
        });
      });
    })
    .catch((error) => console.log(error)); // TODO error porcessing?
}
