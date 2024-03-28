import {
  IChatDataAddRoomMessages,
  IChatDataSetRoomError,
} from "@/context/innerContexts/ChatDataProvider";
import { TSchemaApiV1dbMessagesNewGET } from "../validators/db/messages/generatedTypes";
import { IMessage, TPrismaMessage } from "../prisma/prisma";
import { IChatRooms_updateLastmessage } from "@/context/innerContexts/ChatRoomsProvider";
import getOldestTimestampFromMessagesArray from "./utils/getOldestTimestampFromMessagesArray";
import { IKnownUsersAddUser } from "@/context/innerContexts/KnownUsersProvider";
import generateSignature from "@/util/crypto/aes-cbc/generateSignature";
import apiRequestWrapperWithReauth from "../apiRequestWrapperWithReauth";

interface IGetUnreadMessagesProps {
  params: TSchemaApiV1dbMessagesNewGET;
  dispatchChatData: (
    action: IChatDataAddRoomMessages | IChatDataSetRoomError
  ) => void;
  dispatchChatRooms: (action: IChatRooms_updateLastmessage) => void;
  dispatchKnownUsers: (action: IKnownUsersAddUser) => void;
  accessToken: IAccessToken;
}

export function apiDB_getUnreadMessages({
  params,
  dispatchChatData,
  dispatchChatRooms,
  dispatchKnownUsers,
  accessToken,
}: IGetUnreadMessagesProps) {
  const callback = (result: TPrismaMessage[]) => {
    const unreadMessages: IMessage[] = result.map((message) => ({
      ...message,
      unread: true,
    }));

    // adding new messages to ChatData context
    dispatchChatData({
      type: "addRoomMessages",
      roomName: params.channel_name,
      messages: unreadMessages,
    });

    // finding latest message timestamp
    const lastMessageTimestamp =
      getOldestTimestampFromMessagesArray(unreadMessages);

    // updating last message time stamp in ChatRooms context
    dispatchChatRooms({
      type: "ChatRooms_updateLastmessage",
      roomName: params.channel_name,
      lastmessage: lastMessageTimestamp,
    });

    // relaying messages author to KnowUsers context
    unreadMessages.forEach((message) =>
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
    api: `api/v1/db/messages/new?channel_name=${params.channel_name}&user_id=${params.user_id}`,
    // TODO delete
    // args: {
    //   method: "GET",
    //   headers: {
    //     "pusher-chat-signature": generateSignature({
    //       key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
    //     }),
    //   },
    // },
    accessToken,
    callback,
  });

  // TODO delete
  // fetch(
  //   `api/v1/db/messages/new?channel_name=${params.channel_name}&user_id=${params.user_id}`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "pusher-chat-signature": generateSignature({
  //         key: process.env.NEXT_PUBLIC_API_SIGNATURE_KEY!,
  //       }),
  //     },
  //   }
  // )
  //   .then((response) => response.json())
  //   .then((result: TPrismaMessage[]) => {
  //     const unreadMessages: IMessage[] = result.map((message) => ({
  //       ...message,
  //       unread: true,
  //     }));

  //     // adding new messages to ChatData context
  //     dispatchChatData({
  //       type: "addRoomMessages",
  //       roomName: params.channel_name,
  //       messages: unreadMessages,
  //     });

  //     // finding latest message timestamp
  //     const lastMessageTimestamp =
  //       getOldestTimestampFromMessagesArray(unreadMessages);

  //     // updating last message time stamp in ChatRooms context
  //     dispatchChatRooms({
  //       type: "ChatRooms_updateLastmessage",
  //       roomName: params.channel_name,
  //       lastmessage: lastMessageTimestamp,
  //     });

  //     // relaying messages author to KnowUsers context
  //     unreadMessages.forEach((message) =>
  //       dispatchKnownUsers({
  //         type: "KnownUsers_addKnownUser",
  //         user: {
  //           user_id: message.author,
  //           user_admin: false,
  //           user_name: "loading",
  //         },
  //       })
  //     );
  //   })
  //   .catch((error) =>
  //     dispatchChatData({
  //       type: "setRoomError",
  //       roomName: params.channel_name,
  //       error,
  //     })
  //   );
}
