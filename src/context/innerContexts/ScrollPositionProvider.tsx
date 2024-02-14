"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface IScrollPositionAddRoom {
  type: "ScrollPosition_addRoom";
  room_id: string;
}
export interface IScrollPositionRemoveRoom {
  type: "ScrollPosition_removeRoom";
  room_id: string;
}
export interface IScrollPositionSetScrollPosition {
  type: "setScrollPosition";
  room_id: string;
  currentPosition?: number;
  isPreviousBottom?: boolean;
  previousUnreadMsgCount?: number;
}

type TScrollPositionProviderActions =
  | IScrollPositionAddRoom
  | IScrollPositionRemoveRoom
  | IScrollPositionSetScrollPosition;

export interface IScrollPositionData {
  room_id: string;
  currentPosition: number;
  isPreviousBottom: boolean;
  previousUnreadMsgCount: number;
}

interface IScrollPositionDataContext {
  scrollPositionData: IScrollPositionData[] | null;
  dispatchScrollPosition: (action: TScrollPositionProviderActions) => void;
  getRoomScrollPositionData: (room_id: string) => IScrollPositionData;
}

const ScrollPositionDataContext =
  createContext<IScrollPositionDataContext | null>(null);

export function ScrollPositionDataProvider({
  children,
}: PropsWithChildren<{}>) {
  const initialStateScrollPositionData: IScrollPositionData[] = [];
  const [scrollPositionData, dispatchScrollPosition] = useReducer(
    chatDataReducer,
    initialStateScrollPositionData
  );

  // state actions
  function getRoomScrollPositionData(room_id: string) {
    const roomData = scrollPositionData.find(
      (room) => room.room_id === room_id
    );
    const emptyRoom: IScrollPositionData = {
      room_id,
      currentPosition: 999999,
      isPreviousBottom: false,
      previousUnreadMsgCount: 0,
    };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function chatDataReducer(
    scrollPositionData: IScrollPositionData[],
    action: TScrollPositionProviderActions
  ): IScrollPositionData[] {
    switch (action.type) {
      case "ScrollPosition_addRoom":
        return scrollPositionData.findIndex(
          (room) => room.room_id === action.room_id
        ) === -1
          ? [
              ...scrollPositionData,
              {
                room_id: action.room_id,
                currentPosition: 999999,
                isPreviousBottom: false,
                previousUnreadMsgCount: 0,
              },
            ]
          : scrollPositionData;

      case "ScrollPosition_removeRoom":
        return scrollPositionData.filter(
          (room) => room.room_id !== action.room_id
        );

      case "setScrollPosition":
        return scrollPositionData.map((room) =>
          room.room_id === action.room_id ? { ...room, ...action } : room
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
