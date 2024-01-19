"use client";
import { Message } from "@prisma/client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface IChatDataAddRoom {
  type: "addRoom";
  room_id: string;
}
export interface IChatDataSetRoomError {
  type: "setRoomError";
  room_id: string;
  error: Error;
}
export interface IChatDataAddRoomMessage {
  type: "addRoomMessage";
  room_id: string;
  message: Message;
}
export interface IChatDataAddRoomMessages {
  type: "addRoomMessages";
  room_id: string;
  messages: Message[];
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessage
  | IChatDataAddRoomMessages;

export type TChatDataStateLiteral = "loading" | "success" | "error";

export interface IChatData {
  room_id: string;
  messages: Message[];
  state: TChatDataStateLiteral;
  error?: Error;
}

interface IChatDataContext {
  chatData: IChatData[] | null;
  dispatch: (action: TChatDataProviderActions) => void;
  // setChatData: (
  //   newChatData:
  //     | ((prev: IChatData[] | null) => IChatData[] | null) // figuring out this type took a while
  //     | IChatData[]
  //     | null
  // ) => void;
}

const ChatDataContext = createContext<IChatDataContext | null>(null);

export function ChatDataProvider({ children }: PropsWithChildren<{}>) {
  const initialStateChatData: IChatData[] = [];
  const [chatData, dispatch] = useReducer(
    chatDataReducer,
    initialStateChatData
  );

  function chatDataReducer(
    chatData: IChatData[],
    action: TChatDataProviderActions
  ): IChatData[] {
    switch (action.type) {
      case "addRoom":
        return chatData.findIndex((room) => room.room_id === action.room_id) ===
          -1
          ? [
              ...chatData,
              { room_id: action.room_id, messages: [], state: "loading" },
            ]
          : chatData;
      // case "loadRoom":
      //   await fetch(`/api/v1/db?roomId=${action.room_id}`).then(response => response.json()).then(result => )
      //   return chatData;
      case "addRoomMessage":
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
                messages: [...room.messages, ...action.messages],
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
      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <ChatDataContext.Provider value={{ chatData, dispatch }}>
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
