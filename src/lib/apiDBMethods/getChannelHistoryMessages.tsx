import { z } from "zod";
import { schemaApiV1dbMessagesHistoryGET } from "../validators/db/history";
import {
  IChatDataAddRoomMessages,
  IChatDataSetPaginationHasMore,
  IChatDataSetPaginationState,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";

// TODO extract to Chat params
const PAGE_LIMIT = 10;

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
      | IChatDataSetPaginationHasMore
  ) => void;
}) {
  fetch(
    `/api/v1/db/messages/history?channel_name=${params.channel_name}&user_id=${
      params.user_id
    }&limit=${PAGE_LIMIT}&skip=${"feck"}` // TODO adjust ChatData to provide proper skip  number
  )
    .then((response) => response.json())
    .then((result: Message[]) => {
      const messages: IChatData_MessageExtended[] = result
        ? result.map((message) => ({ ...message, unread: false }))
        : [];

      // console.log(result);
      dispatchChatData({
        type: "setPaginationHasMore",
        room_id: params.channel_name,
        // TODO add hasMore return from api
        newHasMore: false,
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
