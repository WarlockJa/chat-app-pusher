"use client";
import { Message } from "@prisma/client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

// TODO extract to Chat params
const PAGE_LIMIT = process.env.NEXT_PUBLIC_PAGE_LIMIT;

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
export interface IChatDataSetPaginationTotalCount {
  type: "setPaginationTotalCount";
  room_id: string;
  totalCount: number;
}
export interface IChatDataIncreasePaginationPagesLoaded {
  type: "increasePaginationPagesLoaded";
  room_id: string;
}

type TChatDataProviderActions =
  | IChatDataAddRoom
  | IChatDataSetRoomError
  | IChatDataAddRoomMessages
  | IChatDataSetMessageAsRead
  | IChatDataSetScrollPosition
  | IChatDataSetPaginationState
  | IChatDataSetPaginationTotalCount
  | IChatDataIncreasePaginationPagesLoaded
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
                  currentPosition: 999999,
                  isPreviousBottom: false,
                  previousUnreadMsgCount: 0,
                },
                pagination: {
                  historyLoadedState: "success",
                  // hasMore: true,
                  limit: PAGE_LIMIT ? Number(PAGE_LIMIT) : 10,
                  totalCount: 0,
                  pagesLoaded: 0,
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
      case "setPaginationTotalCount":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                pagination: {
                  ...room.pagination,
                  totalCount: action.totalCount,
                },
              }
            : room
        );
      case "increasePaginationPagesLoaded":
        return chatData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                pagination: {
                  ...room.pagination,
                  pagesLoaded: room.pagination.pagesLoaded + 1,
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
