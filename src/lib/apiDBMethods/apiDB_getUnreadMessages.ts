import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { TSchemaApiV1dbMessagesNewGET } from "../validators/db/messages/generatedTypes";
import { IMessage, TPrismaMessage, TPrisma_User } from "../prisma/prisma";
import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";

export interface IGetUnreadMessagesProps {
  params: TSchemaApiV1dbMessagesNewGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  knownUsers_addNewUser: (author: TPrisma_User) => void;
}

export function apiDB_getUnreadMessages({
  params,
  dispatchChatData,
  dispatchChatRooms,
  knownUsers_addNewUser,
}: IGetUnreadMessagesProps) {
  fetch(
    `api/v1/db/messages/new?channel_name=${params.channel_name}&user_id=${params.user_id}`
  )
    .then((response) => response.json())
    .then((result: TPrismaMessage[]) => {
      const unreadMessages: IMessage[] = result.map((message) => ({
        ...message,
        unread: true,
      }));

      // adding new messages to ChatData context
      dispatchChatData({
        type: "addRoomMessages",
        roomName: params.channel_name,
        messages: unreadMessages,
      });

      // TODO abstract to getOlderMessage?
      // finding latest message timestamp
      const lastMessageTimestamp =
        unreadMessages.length > 0
          ? unreadMessages.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))[
              unreadMessages.length - 1
            ].timestamp
          : null;

      // updating last message time stamp in ChatRooms context
      dispatchChatRooms({
        type: "ChatRooms_updateLastmessage",
        roomName: params.channel_name,
        lastmessage: lastMessageTimestamp,
      });

      // relaying messages author to KnowUsers context
      unreadMessages.forEach((message) =>
        knownUsers_addNewUser({
          user_id: message.author,
          user_admin: false,
          user_name: "loading",
        })
      );
    })
    .catch((error) =>
      dispatchChatData({
        type: "setRoomError",
        roomName: params.channel_name,
        error,
      })
    );
}
