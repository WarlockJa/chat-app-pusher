"use client";
import { updateLastAccessTimestamp } from "@/lib/apiDBMethods/updateLastAccessTimestamp";
import { IMessage, TPrisma_ChatData } from "@/lib/prisma/prisma";
import { createContext, useContext, useReducer } from "react";

export interface IChatDataAddRoom {
  type: "ChatData_addRoom";
  roomName: string;
}
export interface IChatDataDeleteRoom {
  type: "ChatData_deleteRoom";
  roomName: string;
}
export interface IChatDataSetRoomError {
  type: "setRoomError";
  roomName: string;
  error: Error;
}
// for optimistic update handling
export interface IChatDataAddRoomMessage {
  type: "addRoomMessage";
  roomName: string;
  message: IMessage;
}
// for bulk messages handling
export interface IChatDataAddRoomMessages {
  type: "addRoomMessages";
  roomName: string;
  messages: IMessage[];
}
export interface IChatDataSetMessageAsRead {
  type: "setMessageAsRead";
  roomName: string;
  message_id: string;
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataDeleteRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessage
  | IChatDataAddRoomMessages
  | IChatDataSetMessageAsRead;

interface IChatDataContext {
  chatData: TPrisma_ChatData[] | null;
  dispatchChatData: (action: TChatDataProviderActions) => void;
  getRoomChatData: (room_id: string) => TPrisma_ChatData;
  getRoomUnreadMessagesCount: (room_id: string) => number;
  getRoomLastMessageTimestamp: (room_id: string) => Date | null;
  // setChatData: (
  //   newChatData:
  //     | ((prev: IChatData[] | null) => IChatData[] | null) // figuring out this type took a while
  //     | IChatData[]
  //     | null
  // ) => void;
}

const ChatDataContext = createContext<IChatDataContext | null>(null);

// export function ChatDataProvider({ children }: PropsWithChildren<{}>) {
export function ChatDataProvider({
  children,
  user_id,
}: {
  children: React.ReactNode | undefined;
  user_id: string;
}) {
  const initialStateChatData: TPrisma_ChatData[] = [];
  const [chatData, dispatchChatData] = useReducer(
    chatDataReducer,
    initialStateChatData
  );

  // state actions
  function getRoomChatData(roomName: string) {
    const roomData = chatData.find((room) => room.name === roomName);
    const emptyRoom: TPrisma_ChatData = {
      name: roomName,
      messages: [],
      state: "loading",
    };
    return roomData ? roomData : emptyRoom;
  }
  function getRoomUnreadMessagesCount(roomName: string) {
    const roomData = chatData.find((room) => room.name === roomName);
    const unreadMessagesCount = roomData
      ? roomData.messages.filter((msg) => msg.unread).length
      : 0;
    return unreadMessagesCount;
  }
  function getRoomLastMessageTimestamp(roomName: string) {
    const roomData = chatData.find((room) => room.name === roomName);
    const lastUnreadMessageTimestamp =
      roomData && roomData?.messages.length > 0
        ? roomData.messages[roomData.messages.length - 1].timestamp
        : null;
    return lastUnreadMessageTimestamp;
  }

  // reducers
  function chatDataReducer(
    chatData: TPrisma_ChatData[],
    action: TChatDataProviderActions
  ): TPrisma_ChatData[] {
    switch (action.type) {
      case "ChatData_addRoom":
        return chatData.findIndex((room) => room.name === action.roomName) ===
          -1
          ? [
              ...chatData,
              {
                name: action.roomName,
                messages: [],
                state: "loading",
              },
            ]
          : chatData;
      case "ChatData_deleteRoom":
        return chatData.filter((room) => room.name !== action.roomName);
      case "addRoomMessage":
        // finding room in chatData for the message
        const messageRoom = chatData.find(
          (room) => room.name === action.roomName
        );
        // if message with action.message.id already present it was added as an optimistic update
        const isMessageOptimistic =
          messageRoom?.messages.findIndex(
            (message) => message.id === action.message.id
          ) !== -1;
        // if message was optimistically added, updating lastaccess in DB
        if (isMessageOptimistic) {
          updateLastAccessTimestamp({
            channel_name: action.roomName,
            user_id,
            message_id: action.message.id,
          });

          return chatData;
        }
        // otherwise if message is new adding message to the chatData
        else
          return chatData.map((room) =>
            room.name === action.roomName
              ? {
                  ...room,
                  messages: [...room.messages, action.message],
                }
              : room
          );
      case "addRoomMessages":
        return chatData.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                // filtering possible duplicates.
                // This is a failsafe for Internet connection disruption that would cause Pusher
                // subscriptions to re-trigger and fetch messages from DB for a second time
                messages: [...room.messages, ...action.messages]
                  .filter(
                    (message, index, self) =>
                      index === self.findIndex((msg) => msg.id === message.id)
                  )
                  .sort((a, b) => (a.timestamp >= b.timestamp ? 1 : -1)),
                state: "success",
              }
            : room
        );
      case "setRoomError":
        return chatData.map((room) =>
          room.name === action.roomName
            ? { ...room, error: action.error, state: "error" }
            : room
        );
      case "setMessageAsRead":
        return chatData.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                messages: room.messages.map((message) =>
                  message.id === action.message_id
                    ? { ...message, unread: false }
                    : message
                ),
              }
            : room
        );
      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <ChatDataContext.Provider
      value={{
        chatData,
        dispatchChatData,
        getRoomChatData,
        getRoomUnreadMessagesCount,
        getRoomLastMessageTimestamp,
      }}
    >
      {children}
    </ChatDataContext.Provider>
  );
}

export function useChatDataContext() {
  const context = useContext(ChatDataContext);

  if (!context) {
    throw new Error("useChatDataContext must be inside ChatDataProvider");
  }

  return context;
}
