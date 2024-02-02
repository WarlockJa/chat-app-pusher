import { z } from "zod";
import { Message } from "@prisma/client";
import {
  IChatDataAddRoomMessages,
  IChatDataSetPaginationHasMore,
  IChatDataSetPaginationState,
  IChatDataSetRoomError,
  IChatData_MessageExtended,
} from "@/context/ChatDataProvider";
import {
  schemaApiV1dbMessagesHistoryGET,
  schemaApiV1dbMessagesHistoryPOST,
} from "./validators/db/history";
import { schemaApiV1dbMessagesLastaccessPOST } from "./validators/db/lastaccess";
import { schemaApiV1dbMessagesNewGET } from "./validators/db/new";

// TODO extract to Chat params
const PAGE_LIMIT = 10;

// inferring api endpoints expected types from zod models
type TSchemaDBMessagesHistoryPOST = z.infer<
  typeof schemaApiV1dbMessagesHistoryPOST
>;
type TSchemaDBMessagesLastaccessPOST = z.infer<
  typeof schemaApiV1dbMessagesLastaccessPOST
>;
type TSchemaDBMessagesHistoryGET = z.infer<
  typeof schemaApiV1dbMessagesHistoryGET
>;
type TSchemaDBMessagesNewGet = z.infer<typeof schemaApiV1dbMessagesNewGET>;

// adding message to the messages array at channel collection in DB
export function addChannelMessage(body: TSchemaDBMessagesHistoryPOST) {
  fetch("/api/v1/db/messages/history", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    // TODO test error handling
    .catch((error: Error) => {
      throw new Error(error.message);
    });
}

// updates user timestamp at lastaccess array for channel collection in DB
export function updateLastAccessTimestamp(
  body: TSchemaDBMessagesLastaccessPOST
) {
  fetch("/api/v1/db/messages/lastaccess", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

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
    }&limit=${PAGE_LIMIT}&skip=${1}` // TODO adjust ChatData to provide proper skip number
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

export function getUnreadMessages({
  params,
  dispatchChatData,
}: {
  params: TSchemaDBMessagesNewGet;
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
