import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { TSchemaApiV1dbMessagesHistoryGET } from "../validators/db/messages/generatedTypes";
import { IPaginationSetPaginationData } from "@/context/innerContexts/PaginationProvider";
import { IMessage, TPrismaMessage } from "../prisma/prisma";

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
    .then((result: { messages: TPrismaMessage[]; hasMore: boolean }) => {
      const messages: IMessage[] = result.messages
        ? result.messages.map((message) => ({ ...message, unread: false }))
        : [];

      // writing new pagination data
      dispatchPagination({
        type: "setPaginationData",
        roomName: params.channel_name,
        hasMore: result.hasMore,
        state: "success",
      });

      // adding history messages to the room chatData
      dispatchChatData({
        type: "addRoomMessages",
        roomName: params.channel_name,
        messages,
      });
    })
    .catch((error) => {
      // error check 'result is null'. No channel found in the DB
      // not actually an error, means no messages were ever created for this room

      // writing error to pagination context
      dispatchPagination({
        type: "setPaginationData",
        roomName: params.channel_name,
        state: "error",
      });

      // TODO move this check to api?
      error.message === "result is null"
        ? dispatchChatData({
            type: "addRoomMessages",
            roomName: params.channel_name,
            messages: [],
          })
        : dispatchChatData({
            type: "setRoomError",
            roomName: params.channel_name,
            error,
          });
    });
}
