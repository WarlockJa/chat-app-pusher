"use client";
import { TPrisma_PaginationData } from "@/lib/prisma/prisma";
import { createContext, useContext, useReducer } from "react";

export interface IPaginationAddRoom {
  type: "Pagination_addRoom";
  roomName: string;
}
export interface IPaginationDeleteRoom {
  type: "Pagination_deleteRoom";
  roomName: string;
}
export interface IPaginationRemoveRoom {
  type: "Pagination_removeRoom";
  roomName: string;
}
export interface IPaginationSetPaginationData {
  type: "setPaginationData";
  roomName: string;
  state?: TStateLiteral;
  limit?: number;
  hasMore?: boolean;
}

type TPaginationProviderActions =
  | IPaginationAddRoom
  | IPaginationDeleteRoom
  | IPaginationRemoveRoom
  | IPaginationSetPaginationData;

interface IPaginationContext {
  paginationData: TPrisma_PaginationData[] | null;
  dispatchPagination: (action: TPaginationProviderActions) => void;
  getRoomPaginationData: (roomName: string) => TPrisma_PaginationData;
}

const PaginationContext = createContext<IPaginationContext | null>(null);

export function PaginationProvider({
  children,
  pageLimit,
}: {
  children: React.ReactNode | undefined;
  pageLimit: number;
}) {
  const initialStateChatData: TPrisma_PaginationData[] = [];
  const [paginationData, dispatchPagination] = useReducer(
    paginationDataReducer,
    initialStateChatData
  );

  // state actions
  function getRoomPaginationData(roomName: string) {
    const roomData = paginationData.find((room) => room.name === roomName);
    const emptyRoom: TPrisma_PaginationData = {
      name: roomName,
      limit: pageLimit,
      hasMore: true,
      state: "success",
    };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function paginationDataReducer(
    paginationData: TPrisma_PaginationData[],
    action: TPaginationProviderActions
  ): TPrisma_PaginationData[] {
    switch (action.type) {
      case "Pagination_addRoom":
        return paginationData.findIndex(
          (room) => room.name === action.roomName
        ) === -1
          ? [
              ...paginationData,
              {
                name: action.roomName,
                limit: pageLimit,
                hasMore: true,
                state: "success",
              },
            ]
          : paginationData;

      case "Pagination_deleteRoom":
        return paginationData.filter((room) => room.name !== action.roomName);

      case "Pagination_removeRoom":
        return [
          ...paginationData.filter((room) => room.name !== action.roomName),
        ];

      case "setPaginationData":
        return paginationData.map((room) =>
          room.name === action.roomName
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
