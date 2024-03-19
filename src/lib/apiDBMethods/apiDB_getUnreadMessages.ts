import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { TSchemaApiV1dbMessagesNewGET } from "../validators/db/messages/generatedTypes";
import { IMessage, TPrismaMessage, TPrisma_User } from "../prisma/prisma";

export interface IGetUnreadMessagesProps {
  params: TSchemaApiV1dbMessagesNewGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  knownUsers_addNewUser: (author: TPrisma_User) => void;
}

export function apiDB_getUnreadMessages({
  params,
  dispatchChatData,
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

      dispatchChatData({
        type: "addRoomMessages",
        roomName: params.channel_name,
        messages: unreadMessages,
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
