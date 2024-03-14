"use client";
import { TPrisma_ScrollPosition } from "@/lib/prisma/prisma";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface IScrollPositionAddRoom {
  type: "ScrollPosition_addRoom";
  roomName: string;
}
export interface IScrollPositionRemoveRoom {
  type: "ScrollPosition_deleteRoom";
  roomName: string;
}
export interface IScrollPositionSetScrollPosition {
  type: "setScrollPosition";
  name: string;
  currentPosition?: number;
  isPreviousBottom?: boolean;
  previousUnreadMsgCount?: number;
}

type TScrollPositionProviderActions =
  | IScrollPositionAddRoom
  | IScrollPositionRemoveRoom
  | IScrollPositionSetScrollPosition;

interface IScrollPositionDataContext {
  scrollPositionData: TPrisma_ScrollPosition[] | null;
  dispatchScrollPosition: (action: TScrollPositionProviderActions) => void;
  getRoomScrollPositionData: (roomName: string) => TPrisma_ScrollPosition;
}

const ScrollPositionDataContext =
  createContext<IScrollPositionDataContext | null>(null);

export function ScrollPositionDataProvider({
  children,
}: PropsWithChildren<{}>) {
  const initialStateScrollPositionData: TPrisma_ScrollPosition[] = [];
  const [scrollPositionData, dispatchScrollPosition] = useReducer(
    chatDataReducer,
    initialStateScrollPositionData
  );

  // state actions
  function getRoomScrollPositionData(roomName: string) {
    const roomData = scrollPositionData.find((room) => room.name === roomName);
    const emptyRoom: TPrisma_ScrollPosition = {
      name: roomName,
      currentPosition: 999999,
      isPreviousBottom: false,
      previousUnreadMsgCount: 0,
    };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function chatDataReducer(
    scrollPositionData: TPrisma_ScrollPosition[],
    action: TScrollPositionProviderActions
  ): TPrisma_ScrollPosition[] {
    switch (action.type) {
      case "ScrollPosition_addRoom":
        return scrollPositionData.findIndex(
          (room) => room.name === action.roomName
        ) === -1
          ? [
              ...scrollPositionData,
              {
                name: action.roomName,
                currentPosition: 999999,
                isPreviousBottom: false,
                previousUnreadMsgCount: 0,
              },
            ]
          : scrollPositionData;

      case "ScrollPosition_deleteRoom":
        return scrollPositionData.filter(
          (room) => room.name !== action.roomName
        );

      case "setScrollPosition":
        return scrollPositionData.map((room) =>
          room.name === action.name ? { ...room, ...action } : room
        );

      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <ScrollPositionDataContext.Provider
      value={{
        scrollPositionData,
        dispatchScrollPosition,
        getRoomScrollPositionData,
      }}
    >
      {children}
    </ScrollPositionDataContext.Provider>
  );
}

export function useScrollPositionDataContext() {
  const context = useContext(ScrollPositionDataContext);

  if (!context) {
    throw new Error(
      "useScrollPositionDataContext must be inside ScrollPositionDataProvider"
    );
  }

  return context;
}
