import { IChatRoomsAddNewRoom } from "@/context/innerContexts/ChatRoomsProvider";
import { TPrisma_User } from "../prisma/prisma";

export function getChannels({
  dispatchChatRooms,
}: {
  dispatchChatRooms: (action: IChatRoomsAddNewRoom) => void;
}) {
  fetch(`api/v1/db/channel`)
    .then((response) => response.json())
    .then(
      (
        channels: {
          name: string;
          owner: TPrisma_User;
          lastmessage: Date | null;
        }[]
      ) => {
        channels.map((channel) => {
          dispatchChatRooms({
            type: "ChatRooms_addNewRoom",
            roomName: channel.name,
            owner: channel.owner,
            lastmessage: channel.lastmessage,
          });
        });
      }
    )
    .catch((error) => console.log(error)); // TODO error porcessing?
}
