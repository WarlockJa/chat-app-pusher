"use client";
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
export interface IChatDataSetPaginationLimit {
  type: "setPaginationLimit";
  room_id: string;
  limit: number;
}
export interface IChatDataSetPaginationHasMore {
  type: "setPaginationHasMore";
  room_id: string;
  hasMore: boolean;
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessages
  | IChatDataSetMessageAsRead
  | IChatDataSetScrollPosition
  | IChatDataSetPaginationState
  | IChatDataSetPaginationHasMore
  | IChatDataSetPaginationLimit;

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

// TODO divide into several contexts [pagination, typing, scrollPosition, messages]
// export function ChatDataProvider({ children }: PropsWithChildren<{}>) {
export function ChatDataProvider({
  children,
  pageLimit,
}: {
  children: React.ReactNode | undefined;
  pageLimit: number;
}) {
  const initialStateChatData: IChatData[] = [];
  const [chatData, dispatchChatData] = useReducer(
    chatDataReducer,
    initialStateChatData
  );

  // state methods
  function getRoomChatData(room_id: string) {
    const roomData = chatData.find((room) => room.room_id === room_id);
    const emptyRoom: IChatData = {
      room_id,
      messages: [],
      state: "loading",
      scrollPosition: {
        currentPosition: 999999,
        isPreviousBottom: false,
        previousUnreadMsgCount: 0,
      },
      pagination: {
        historyLoadedState: "success",
        hasMore: true,
        limit: pageLimit,
      },
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
                scrollPosition: {
                  currentPosition: 999999,
                  isPreviousBottom: false,
                  previousUnreadMsgCount: 0,
                },
                pagination: {
                  historyLoadedState: "success",
                  hasMore: true,
                  limit: pageLimit,
                },
              },
            ]
          : chatData;
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
                      index === self.findIndex((msg) => msg.id === message.id) // add optimistic update handling
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
      case "setPaginationLimit":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                pagination: {
                  ...room.pagination,
                  limit: action.limit,
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
                  hasMore: action.hasMore,
                },
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
