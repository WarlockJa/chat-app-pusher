import {
  IChatDataAddRoomMessages,
  IChatDataSetPaginationState,
  IChatDataSetPaginationHasMore,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";
import { TSchemaApiV1dbMessagesHistoryGET } from "../validators/db/generatedTypes";

// get messages from DB for channel collection
export function getChannelHistoryMessages({
  params,
  dispatchChatData,
}: {
  params: TSchemaApiV1dbMessagesHistoryGET;
  dispatchChatData: (
    action:
      | IChatDataAddRoomMessages
      | IChatDataSetRoomError
      | IChatDataSetPaginationState
      | IChatDataSetPaginationHasMore
  ) => void;
}) {
  fetch(
    `/api/v1/db/messages/history?channel_name=${params.channel_name}${
      params.message_id ? `&message_id=${params.message_id}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}`
  )
    .then((response) => response.json())
    .then((result: { messages: Message[]; hasMore: boolean }) => {
      const messages: IChatData_MessageExtended[] = result.messages
        ? result.messages.map((message) => ({ ...message, unread: false }))
        : [];

      // setting totalCount for available history messages on first fetch
      dispatchChatData({
        type: "setPaginationHasMore",
        room_id: params.channel_name,
        hasMore: result.hasMore,
      });

      // chat history loaded flag
      dispatchChatData({
        type: "setPaginationState",
        room_id: params.channel_name,
        newState: "success",
      });

      // adding history messages to the room chatData
      dispatchChatData({
        type: "addRoomMessages",
        room_id: params.channel_name,
        messages,
      });
    })
    .catch((error) => {
      // error check 'result is null'. No channel found in the DB
      // not actually an error, means no messages were ever created for this room

      // chat history loaded flag
      dispatchChatData({
        type: "setPaginationState",
        room_id: params.channel_name,
        newState: "error",
      });

      // TODO move this check to api?
      error.message === "result is null"
        ? dispatchChatData({
            type: "addRoomMessages",
            room_id: params.channel_name,
            messages: [],
          })
        : dispatchChatData({
            type: "setRoomError",
            room_id: params.channel_name,
            error,
          });
    });
}
