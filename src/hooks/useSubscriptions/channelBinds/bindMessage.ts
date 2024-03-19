import { IChatDataAddRoomMessage } from "@/context/innerContexts/ChatDataProvider";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { TSchemaApiV1PusherMessagePost } from "@/lib/validators/pusher/generatedTypes";
import { PresenceChannel } from "pusher-js";

interface IBindMessageProps {
  newChannel: PresenceChannel;
  dispatchChatData: (props: IChatDataAddRoomMessage) => void;
  knownUsers_addNewUser: (user: TPrisma_User) => void;
}

export default function bindMessage({
  newChannel,
  dispatchChatData,
  knownUsers_addNewUser,
}: IBindMessageProps) {
  newChannel.bind(
    "message",
    async function (data: Omit<TSchemaApiV1PusherMessagePost, "activeRoom">) {
      // adding new message to the chatData
      dispatchChatData({
        type: "addRoomMessage",
        roomName: newChannel.name,
        message: {
          id: data.id,
          text: data.message,
          author: data.author,
          timestamp: new Date().toISOString(),
          unread: true,
        },
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
