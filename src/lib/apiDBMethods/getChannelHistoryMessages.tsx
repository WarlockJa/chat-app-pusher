import { z } from "zod";
import { schemaApiV1dbMessagesHistoryGET } from "../validators/db/history";
import {
  IChatDataAddRoomMessages,
  IChatDataIncreasePaginationPagesLoaded,
  IChatDataSetPaginationState,
  IChatDataSetPaginationTotalCount,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";

// inferring api endpoints expected types from zod models
type TSchemaDBMessagesHistoryGET = z.infer<
  typeof schemaApiV1dbMessagesHistoryGET
>;

// get messages from DB for channel collection
export function getChannelHistoryMessages({
  params,
  dispatchChatData,
}: {
  params: TSchemaDBMessagesHistoryGET;
  dispatchChatData: (
    action:
      | IChatDataAddRoomMessages
      | IChatDataSetRoomError
      | IChatDataSetPaginationState
      | IChatDataSetPaginationTotalCount
      | IChatDataIncreasePaginationPagesLoaded
  ) => void;
}) {
  fetch(
    `/api/v1/db/messages/history?channel_name=${params.channel_name}&user_id=${params.user_id}&limit=${params.limit}&skip=${params.skip}` // TODO adjust ChatData to provide proper skip value
  )
    .then((response) => response.json())
    .then((result: { messages: Message[]; totalCount: number }) => {
      const messages: IChatData_MessageExtended[] = result.messages
        ? result.messages.map((message) => ({ ...message, unread: false }))
        : [];

      // console.log(params.limit, params.skip);
      console.log(result);
      // setting totalCount for available history messages on first fetch
      if (result.totalCount !== 0)
        dispatchChatData({
          type: "setPaginationTotalCount",
          room_id: params.channel_name,
          totalCount: result.totalCount,
        });

      // increasing pagesLoaded counter for the room
      dispatchChatData({
        type: "increasePaginationPagesLoaded",
        room_id: params.channel_name,
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
