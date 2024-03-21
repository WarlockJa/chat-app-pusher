import { IChatRoomsAddNewRoom } from "@/context/innerContexts/ChatRoomsProvider";
import { TPrisma_User } from "../prisma/prisma";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";

export function apiDB_getAllChannelsList({
  dispatchChatRooms,
  dispatchKnownUsers,
}: {
  dispatchChatRooms: (action: IChatRoomsAddNewRoom) => void;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
}) {
  fetch(`api/v1/db/channel`, {
    method: "GET",
    headers: {
      "pusher-chat-signature": process.env.NEXT_PUBLIC_API_ACCESS_TOKEN!,
    },
  })
    .then((response) => response.json())
    .then(
      (
        channels: {
          name: string;
          owner: TPrisma_User;
          lastmessage: string | null;
        }[]
      ) => {
        channels.map((channel) => {
          dispatchChatRooms({
            type: "ChatRooms_addNewRoom",
            roomName: channel.name,
            owner: channel.owner,
            lastmessage: channel.lastmessage,
          });

          dispatchKnownUsers({
            type: "KnownUsers_addKnownUser",
            user: channel.owner,
          });
        });
      }
    )
    .catch((error) => console.log(error)); // TODO error porcessing?
}
