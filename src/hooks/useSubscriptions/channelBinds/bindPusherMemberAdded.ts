import {
  IChatRoomsAddNewRoom,
  IChatRooms_addUserToRoomUsersList,
} from "@/context/innerContexts/ChatRoomsProvider";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { PresenceChannel } from "pusher-js";

interface IBindPusherMemeberAddedProps {
  newChannel: PresenceChannel;
  dispatchChatRooms: (
    action: IChatRoomsAddNewRoom | IChatRooms_addUserToRoomUsersList
  ) => void;
}

export default function bindPusherMemberAdded({
  newChannel,
  dispatchChatRooms,
}: IBindPusherMemeberAddedProps) {
  newChannel.bind("pusher:member_added", (data: ITriggerEventData) => {
    // a new member added to the channel
    const newUser: TPrisma_User = {
      user_id: data.id,
      user_name: data.info.user_name,
      user_admin: data.info.user_admin,
    };

    // for user: admin subscribed to the user's own channel
    // for admin: user returns to the channel admin already subscribed to
    dispatchChatRooms({
      type: "ChatRooms_addUserToRoomUsersList",
      user: newUser,
      roomName: newChannel.name,
    });

    // admin only logic. users are not subscribed to member_added event on presence-system
    if (newChannel.name === "presence-system") {
      // creating room based on member_added data
      dispatchChatRooms({
        type: "ChatRooms_addNewRoom",
        roomName: `presence-${data.id}`,
        owner: {
          user_id: data.id,
          user_name: data.info.user_name,
          user_admin: data.info.user_admin,
        },
        lastmessage: null,
      });
    }
  });
}
