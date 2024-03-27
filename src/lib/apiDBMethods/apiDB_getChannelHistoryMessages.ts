import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { TSchemaApiV1dbMessagesHistoryGET } from "../validators/db/messages/generatedTypes";
import { IPaginationSetPaginationData } from "@/context/innerContexts/PaginationProvider";
import { IMessage, TPrismaMessage } from "../prisma/prisma";
import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import getOldestTimestampFromMessagesArray from "./utils/getOldestTimestampFromMessagesArray";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";

// get messages from DB for channel collection
export function apiDB_getChannelHistoryMessages({
  params,
  dispatchChatData,
  dispatchPagination,
  dispatchChatRooms,
  dispatchKnownUsers,
}: {
  params: TSchemaApiV1dbMessagesHistoryGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  dispatchPagination: (action: IPaginationSetPaginationData) => void;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
}) {
  fetch(
    `/api/v1/db/messages/history?channel_name=${params.channel_name}${
      params.message_id ? `&message_id=${params.message_id}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}`,
    {
      method: "GET",
      headers: {
        "pusher-chat-signature": generateSignature({
          key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
        }),
      },
    }
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

      // finding latest message timestamp
      const lastMessageTimestamp = getOldestTimestampFromMessagesArray(
        result.messages
      );

      // updating last message time stamp in ChatRooms context
      dispatchChatRooms({
        type: "ChatRooms_updateLastmessage",
        roomName: params.channel_name,
        lastmessage: lastMessageTimestamp,
      });

      // relaying messages author to KnowUsers context
      messages.forEach((message) =>
        dispatchKnownUsers({
          type: "KnownUsers_addKnownUser",
          user: {
            user_id: message.author,
            user_admin: false,
            user_name: "loading",
          },
        })
      );
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
