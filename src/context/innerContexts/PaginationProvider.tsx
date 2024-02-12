"use client";
import { createContext, useContext, useReducer } from "react";

export interface IPaginationAddRoom {
  type: "Pagination_addRoom";
  room_id: string;
}
export interface IPaginationRemoveRoom {
  type: "Pagination_removeRoom";
  room_id: string;
}
export interface IPaginationSetPaginationData {
  type: "setPaginationData";
  room_id: string;
  historyLoadedState?: TChatDataStateLiteral;
  limit?: number;
  hasMore?: boolean;
}

type TPaginationProviderActions =
  | IPaginationAddRoom
  | IPaginationRemoveRoom
  | IPaginationSetPaginationData;

interface IPaginationData {
  room_id: string;
  historyLoadedState: TChatDataStateLiteral; // states for fetching history page
  limit: number; // amount to fetch per page
  hasMore: boolean; // flag for data availability
}

interface IPaginationContext {
  paginationData: IPaginationData[] | null;
  dispatchPagination: (action: TPaginationProviderActions) => void;
  getRoomPaginationData: (room_id: string) => IPaginationData;
}

const PaginationContext = createContext<IPaginationContext | null>(null);

export function PaginationProvider({
  children,
  pageLimit,
}: {
  children: React.ReactNode | undefined;
  pageLimit: number;
}) {
  const initialStateChatData: IPaginationData[] = [];
  const [paginationData, dispatchPagination] = useReducer(
    paginationDataReducer,
    initialStateChatData
  );

  // state methods
  function getRoomPaginationData(room_id: string) {
    const roomData = paginationData.find((room) => room.room_id === room_id);
    const emptyRoom: IPaginationData = {
      room_id,
      limit: pageLimit,
      hasMore: true,
      historyLoadedState: "success",
    };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function paginationDataReducer(
    paginationData: IPaginationData[],
    action: TPaginationProviderActions
  ): IPaginationData[] {
    switch (action.type) {
      case "Pagination_addRoom":
        return paginationData.findIndex(
          (room) => room.room_id === action.room_id
        ) === -1
          ? [
              ...paginationData,
              {
                room_id: action.room_id,
                limit: pageLimit,
                hasMore: true,
                historyLoadedState: "success",
              },
            ]
          : paginationData;

      case "Pagination_removeRoom":
        return [
          ...paginationData.filter((room) => room.room_id !== action.room_id),
        ];

      case "setPaginationData":
        return paginationData.map((room) =>
          room.room_id === action.room_id
            ? {
                ...room,
                ...action,
              }
            : room
        );
      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <PaginationContext.Provider
      value={{ paginationData, dispatchPagination, getRoomPaginationData }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePaginationContext() {
  const context = useContext(PaginationContext);

  if (!context) {
    throw new Error("usePaginationContext must be inside PaginationProvider");
  }

  return context;
}
