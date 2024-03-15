import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { Message } from "@prisma/client";
import { TSchemaApiV1dbMessagesNewGET } from "../validators/db/messages/generatedTypes";
import { IMessage, TPrismaMessage } from "../prisma/prisma";

export function getUnreadMessages({
  params,
  dispatchChatData,
}: {
  params: TSchemaApiV1dbMessagesNewGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
}) {
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
    })
    .catch((error) =>
      dispatchChatData({
        type: "setRoomError",
        roomName: params.channel_name,
        error,
      })
    );
}
