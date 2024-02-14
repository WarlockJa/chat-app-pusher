"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

export interface IUsersTypingAddRoom {
  type: "UsersTyping_addRoom";
  room_id: string;
}
export interface IUsersTypingRemoveRoom {
  type: "UsersTyping_removeRoom";
  room_id: string;
}
export interface IUsersTypingAddTypingUser {
  type: "addTypingUser";
  room_id: string;
  user: string;
}
export interface IUsersTypingRemoveTypingUser {
  type: "removeTypingUser";
  room_id: string;
  user: string;
}

type TUsersTypingProviderActions =
  | IUsersTypingAddRoom
  | IUsersTypingRemoveRoom
  | IUsersTypingAddTypingUser
  | IUsersTypingRemoveTypingUser;

export interface IUsersTypingData {
  users: string[];
  room_id: string;
}

interface IUsersTypingContext {
  usersTyping: IUsersTypingData[];
  dispatchUsersTyping: (action: TUsersTypingProviderActions) => void;
  getRoomTypingUsers: (room_id: string) => IUsersTypingData;
}

const UsersTypingContext = createContext<IUsersTypingContext | null>(null);

// UsersTyping context. Contains data about users currently typing in the room.
export function UsersTypingProvider({ children }: PropsWithChildren<{}>) {
  const initialUsersTypingData: IUsersTypingData[] = [];
  const [usersTyping, dispatchUsersTyping] = useReducer(
    usersTypingReducer,
    initialUsersTypingData
  );

  // state actions
  function getRoomTypingUsers(room_id: string) {
    const roomData = usersTyping.find((room) => room.room_id === room_id);
    const emptyRoom: IUsersTypingData = { room_id, users: [] };
    return roomData ? roomData : emptyRoom;
  }

  // reducers
  function usersTypingReducer(
    usersTyping: IUsersTypingData[],
    action: TUsersTypingProviderActions
  ): IUsersTypingData[] {
    switch (action.type) {
      case "UsersTyping_addRoom":
        return usersTyping.findIndex(
          (room) => room.room_id === action.room_id
        ) === -1
          ? [...usersTyping, { room_id: action.room_id, users: [] }]
          : usersTyping;

      case "UsersTyping_removeRoom":
        return [
          ...usersTyping.filter((room) => room.room_id !== action.room_id),
        ];

      case "addTypingUser":
        return usersTyping.map((room) =>
          room.room_id === action.room_id
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
          room.room_id === action.room_id
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
