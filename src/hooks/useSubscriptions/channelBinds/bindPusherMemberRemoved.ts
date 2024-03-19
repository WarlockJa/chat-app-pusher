import { IChatRooms_removeUserFromRoomUsersList } from "@/context/innerContexts/ChatRoomsProvider";
import { PresenceChannel } from "pusher-js";

interface IBindMemberRemovedProps {
  newChannel: PresenceChannel;
  dispatchChatRooms: (action: IChatRooms_removeUserFromRoomUsersList) => void;
}

export default function bindPusherMemberRemoved({
  newChannel,
  dispatchChatRooms,
}: IBindMemberRemovedProps) {
  newChannel.bind("pusher:member_removed", (data: ITriggerEventData) => {
    // update users number for the binded channel when a member leaves
    dispatchChatRooms({
      type: "ChatRooms_removeUserFromRoomUsersList",
      roomName: newChannel.name,
      user_id: data.id,
    });
  });
}
