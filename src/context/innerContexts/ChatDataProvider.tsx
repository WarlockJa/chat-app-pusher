"use client";
import { updateLastAccessTimestamp } from "@/lib/apiDBMethods/updateLastAccessTimestamp";
import { Message } from "@prisma/client";
import { createContext, useContext, useReducer } from "react";

export interface IChatData_MessageExtended extends Message {
  unread: boolean;
}

export interface IChatDataAddRoom {
  type: "ChatData_addRoom";
  room_id: string;
}
export interface IChatDataSetRoomError {
  type: "setRoomError";
  room_id: string;
  error: Error;
}
// for optimistic update handling
export interface IChatDataAddRoomMessage {
  type: "addRoomMessage";
  room_id: string;
  message: IChatData_MessageExtended;
}
// for bulk messages handling
export interface IChatDataAddRoomMessages {
  type: "addRoomMessages";
  room_id: string;
  messages: IChatData_MessageExtended[];
}
export interface IChatDataSetMessageAsRead {
  type: "setMessageAsRead";
  room_id: string;
  message_id: string;
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessage
  | IChatDataAddRoomMessages
  | IChatDataSetMessageAsRead;

export interface IChatData {
  room_id: string; // Pusher channel name
  messages: IChatData_MessageExtended[]; // array of messages type from Prisma
  state: TChatDataStateLiteral; // current room loading state
  error?: Error;
}

interface IChatDataContext {
  chatData: IChatData[] | null;
  dispatchChatData: (action: TChatDataProviderActions) => void;
  getRoomChatData: (room_id: string) => IChatData;
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
  const initialStateChatData: IChatData[] = [];
  const [chatData, dispatchChatData] = useReducer(
    chatDataReducer,
    initialStateChatData
  );

  // state actions
  function getRoomChatData(room_id: string) {
    const roomData = chatData.find((room) => room.room_id === room_id);
    const emptyRoom: IChatData = {
      room_id,
      messages: [],
      state: "loading",
    };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function chatDataReducer(
    chatData: IChatData[],
    action: TChatDataProviderActions
  ): IChatData[] {
    switch (action.type) {
      case "ChatData_addRoom":
        return chatData.findIndex((room) => room.room_id === action.room_id) ===
          -1
          ? [
              ...chatData,
              {
                room_id: action.room_id,
                messages: [],
                state: "loading",
              },
            ]
          : chatData;
      case "addRoomMessage":
        // finding room in chatData for the message
        const messageRoom = chatData.find(
          (room) => room.room_id === action.room_id
        );
        // if message with action.message.id already present it was added as an optimistic update
        const isMessageOptimistic =
          messageRoom?.messages.findIndex(
            (message) => message.id === action.message.id
          ) !== -1;
        // if message was optimistically added, updating lastaccess in DB
        if (isMessageOptimistic) {
          updateLastAccessTimestamp({
            channel_name: action.room_id,
            user_id,
            message_id: action.message.id,
          });

          return chatData;
        }
        // otherwise if message is new adding message to the chatData
        else
          return chatData.map((room) =>
            room.room_id === action.room_id
              ? {
                  ...room,
                  messages: [...room.messages, action.message],
                }
              : room
          );
      case "addRoomMessages":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                // filtering possible duplicates.
                // This is a failsafe for Internet connection disruption that would cause Pusher
                // subscriptions to re-trigger and fetch messages from DB for a second time
                messages: [...room.messages, ...action.messages]
                  .filter(
                    (message, index, self) =>
                      index === self.findIndex((msg) => msg.id === message.id) // TODO add optimistic update handling
                  )
                  .sort((a, b) => (a.timestamp >= b.timestamp ? 1 : -1)),
                state: "success",
              }
            : room
        );
      case "setRoomError":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? { ...room, error: action.error, state: "error" }
            : room
        );
      case "setMessageAsRead":
        return chatData.map((room) =>
          room.room_id === action.room_id
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
      value={{ chatData, dispatchChatData, getRoomChatData }}
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
