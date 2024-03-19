import { IChatDataAddRoomMessage } from "@/context/innerContexts/ChatDataProvider";
import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { TSchemaApiV1PusherMessagePost } from "@/lib/validators/pusher/generatedTypes";
import { PresenceChannel } from "pusher-js";

interface IBindMessageProps {
  newChannel: PresenceChannel;
  dispatchChatData: (action: IChatDataAddRoomMessage) => void;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  knownUsers_addNewUser: (user: TPrisma_User) => void;
}

export default function bindMessage({
  newChannel,
  dispatchChatData,
  dispatchChatRooms,
  knownUsers_addNewUser,
}: IBindMessageProps) {
  newChannel.bind(
    "message",
    async function (data: Omit<TSchemaApiV1PusherMessagePost, "activeRoom">) {
      const messageTimestamp = new Date().toISOString();
      // adding new message to the chatData
      dispatchChatData({
        type: "addRoomMessage",
        roomName: newChannel.name,
        message: {
          id: data.id,
          text: data.message,
          author: data.author,
          timestamp: messageTimestamp,
          unread: true,
        },
      });

      // updating last message time stamp in ChatRooms context
      dispatchChatRooms({
        type: "ChatRooms_updateLastmessage",
        roomName: newChannel.name,
        lastmessage: messageTimestamp,
      });

      // relaying message author to KnowUsers context
      knownUsers_addNewUser({
        user_id: data.author,
        user_admin: false,
        user_name: "loading",
      });
    }
  );
}
