import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/innerContexts/ChatDataProvider";
import { Message } from "@prisma/client";
import { TSchemaApiV1dbMessagesNewGET } from "../validators/db/generatedTypes";

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
    .then((result: Message[]) => {
      const unreadMessages: IChatData_MessageExtended[] = result.map(
        (message) => ({ ...message, unread: true })
      );
      // console.log(result);
      dispatchChatData({
        type: "addRoomMessages",
        room_id: params.channel_name,
        messages: unreadMessages,
      });
    })
    .catch((error) =>
      dispatchChatData({
        type: "setRoomError",
        room_id: params.channel_name,
        error,
      })
    );
}
