import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/innerContexts/ChatDataProvider";
import { Message } from "@prisma/client";
import { TSchemaApiV1dbMessagesHistoryGET } from "../validators/db/messages/generatedTypes";
import { IPaginationSetPaginationData } from "@/context/innerContexts/PaginationProvider";

// get messages from DB for channel collection
export function getChannelHistoryMessages({
  params,
  dispatchChatData,
  dispatchPagination,
}: {
  params: TSchemaApiV1dbMessagesHistoryGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchPagination: (action: IPaginationSetPaginationData) => void;
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

      // writing new pagination data
      dispatchPagination({
        type: "setPaginationData",
        room_id: params.channel_name,
        hasMore: result.hasMore,
        historyLoadedState: "success",
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

      // writing error to pagination context
      dispatchPagination({
        type: "setPaginationData",
        room_id: params.channel_name,
        historyLoadedState: "error",
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
