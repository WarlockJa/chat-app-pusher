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
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

// get messages from DB for channel collection
export function apiDB_getChannelHistoryMessages({
  params,
  dispatchChatData,
  dispatchPagination,
  dispatchChatRooms,
  dispatchKnownUsers,
  accessToken,
}: {
  params: TSchemaApiV1dbMessagesHistoryGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  dispatchPagination: (action: IPaginationSetPaginationData) => void;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
  accessToken: IAccessToken;
}) {
  const callback = (result: {
    messages: TPrismaMessage[];
    hasMore: boolean;
  }) => {
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
  };

  // wrapping request in reauth wrapper
  apiRequestWrapperWithReauth({
    api: `/api/v1/db/messages/history?channel_name=${params.channel_name}${
      params.message_id ? `&message_id=${params.message_id}` : ""
    }${params.limit ? `&limit=${params.limit}` : ""}`,
    accessToken,
    callback,
  });
}
