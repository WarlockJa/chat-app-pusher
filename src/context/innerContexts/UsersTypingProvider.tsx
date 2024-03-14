"use client";
import { TPrisma_UsersTyping } from "@/lib/prisma/prisma";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface IUsersTypingAddRoom {
  type: "UsersTyping_addRoom";
  roomName: string;
}
export interface IUsersTypingRemoveRoom {
  type: "UsersTyping_deleteRoom";
  roomName: string;
}
export interface IUsersTypingAddTypingUser {
  type: "addTypingUser";
  roomName: string;
  user: string;
}
export interface IUsersTypingRemoveTypingUser {
  type: "removeTypingUser";
  roomName: string;
  user: string;
}

type TUsersTypingProviderActions =
  | IUsersTypingAddRoom
  | IUsersTypingRemoveRoom
  | IUsersTypingAddTypingUser
  | IUsersTypingRemoveTypingUser;

interface IUsersTypingContext {
  usersTyping: TPrisma_UsersTyping[];
  dispatchUsersTyping: (action: TUsersTypingProviderActions) => void;
  getRoomTypingUsers: (roomName: string) => TPrisma_UsersTyping;
}

const UsersTypingContext = createContext<IUsersTypingContext | null>(null);

// UsersTyping context. Contains data about users currently typing in the room.
export function UsersTypingProvider({ children }: PropsWithChildren<{}>) {
  const initialUsersTypingData: TPrisma_UsersTyping[] = [];
  const [usersTyping, dispatchUsersTyping] = useReducer(
    usersTypingReducer,
    initialUsersTypingData
  );

  // state actions
  function getRoomTypingUsers(roomName: string) {
    const roomData = usersTyping.find((room) => room.name === roomName);
    const emptyRoom: TPrisma_UsersTyping = { name: roomName, users: [] };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function usersTypingReducer(
    usersTyping: TPrisma_UsersTyping[],
    action: TUsersTypingProviderActions
  ): TPrisma_UsersTyping[] {
    switch (action.type) {
      case "UsersTyping_addRoom":
        return usersTyping.findIndex(
          (room) => room.name === action.roomName
        ) === -1
          ? [...usersTyping, { name: action.roomName, users: [] }]
          : usersTyping;

      case "UsersTyping_deleteRoom":
        return [...usersTyping.filter((room) => room.name !== action.roomName)];

      case "addTypingUser":
        return usersTyping.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                users: [
                  ...room.users.filter((user) => user !== action.user),
                  action.user,
                ],
              }
            : room
        );

      case "removeTypingUser":
        return usersTyping.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                users: [...room.users.filter((user) => user !== action.user)],
              }
            : room
        );

      default:
        throw Error("Unknown action: " + JSON.stringify(action));
    }
  }

  return (
    <UsersTypingContext.Provider
      value={{ usersTyping, getRoomTypingUsers, dispatchUsersTyping }}
    >
      {children}
    </UsersTypingContext.Provider>
  );
}

export function useUsersTypingContext() {
  const context = useContext(UsersTypingContext);

  if (!context) {
    throw new Error("useUsersTypingContext must be inside ChatDataProvider");
  }

  return context;
}
