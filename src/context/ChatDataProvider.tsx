"use client";
import { Message } from "@prisma/client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

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
export interface IChatDataAddRoomMessage {
  type: "addRoomMessage";
  room_id: string;
  message: IChatData_MessageExtended;
}
export interface IChatDataAddRoomMessages {
  type: "addRoomMessages";
  room_id: string;
  messages: IChatData_MessageExtended[];
}
export interface IChatDataSetMessageAsRead {
  type: "setMessageAsRead";
  room_id: string;
  msgID: string; //workaround value is a string message.author+message.timestamp
}
export interface IChatDataSetScrollPosition {
  type: "setScrollPosition";
  room_id: string;
  scrollPosition: IScrollPosition;
}
export interface IChatDataSetPaginationState {
  type: "setPaginationState";
  room_id: string;
  newState: TChatDataStateLiteral;
}
export interface IChatDataSetPaginationHasMore {
  type: "setPaginationHasMore";
  room_id: string;
  newHasMore: boolean;
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessage
  | IChatDataAddRoomMessages
  | IChatDataSetMessageAsRead
  | IChatDataSetScrollPosition
  | IChatDataSetPaginationState
  | IChatDataSetPaginationHasMore;

export interface IChatData {
  room_id: string; // Pusher channel name
  messages: IChatData_MessageExtended[]; // array of messages type from Prisma
  state: TChatDataStateLiteral; // current room loading state
  scrollPosition: IScrollPosition;
  pagination: IChatDataPagination;
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
      case "ChatData_addRoom":
        return chatData.findIndex((room) => room.room_id === action.room_id) ===
          -1
          ? [
              ...chatData,
              {
                room_id: action.room_id,
                messages: [],
                state: "loading",
                scrollPosition: {
                  currentPosition: 0,
                  isPreviousBottom: false,
                  previousScrollHeight: 0,
                },
                pagination: {
                  historyLoadedState: "success",
                  hasMore: true,
                },
              },
            ]
          : chatData;
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
                messages: [...room.messages, ...action.messages].sort((a, b) =>
                  a.timestamp >= b.timestamp ? 1 : -1
                ),
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
                  message.author + message.timestamp === action.msgID
                    ? { ...message, unread: false }
                    : message
                ),
              }
            : room
        );
      case "setScrollPosition":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? { ...room, scrollPosition: action.scrollPosition }
            : room
        );
      case "setPaginationState":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                pagination: {
                  ...room.pagination,
                  historyLoadedState: action.newState,
                },
              }
            : room
        );
      case "setPaginationHasMore":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                pagination: {
                  ...room.pagination,
                  hasMore: action.newHasMore,
                },
              }
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
