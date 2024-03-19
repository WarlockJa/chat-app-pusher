import { TPrisma_ChatRooms, TPrisma_User } from "@/lib/prisma/prisma";
import { createContext, useContext, useReducer, useState } from "react";

export interface IChatRoomsSetRoomData {
  type: "ChatRooms_setRoomData";
  roomName: string;
  owner?: TPrisma_User;
  state?: TStateLiteral;
  lastmessage?: string | null;
}

export interface IChatRoomsAddNewRoom {
  type: "ChatRooms_addNewRoom";
  roomName: string;
  owner: TPrisma_User;
  lastmessage: string | null;
}

export interface IChatRooms_addUserToRoomUsersList {
  type: "ChatRooms_addUserToRoomUsersList";
  user: TPrisma_User;
  roomName: string;
}

export interface IChatRooms_removeUserFromRoomUsersList {
  type: "ChatRooms_removeUserFromRoomUsersList";
  user_id: string;
  roomName: string;
}

export interface IChatRooms_updateLastmessage {
  type: "ChatRooms_updateLastmessage";
  roomName: string;
  lastmessage: string | null;
}

type TChatRoomsProviderActions =
  | IChatRoomsAddNewRoom
  | { type: "ChatRooms_deleteRoom"; roomName: string }
  | IChatRoomsSetRoomData
  | IChatRooms_removeUserFromRoomUsersList
  | IChatRooms_addUserToRoomUsersList
  | IChatRooms_updateLastmessage;

interface IChatRoomsContext {
  activeRoom: string;
  setActiveRoom: (newActiveRooms: string) => void;

  roomsList: TPrisma_ChatRooms[];
  dispatchChatRooms: (action: TChatRoomsProviderActions) => void;
  getRoomOwnerData: (roomName: string) => TPrisma_User | null;
  isOwnerPresent: (roomName: string) => boolean | null;
  getPresentAdmin: (roomName: string) => TPrisma_User | undefined | null;
}

const ChatRoomsContext = createContext<IChatRoomsContext | null>(null);

export function ChatRoomsProvider({
  children,
  userId,
}: {
  children: React.ReactNode | undefined;
  userId: TPrisma_User;
}) {
  // reading userId from higher level UserIdProvider context.
  // in this app userId will always be populated when ChatRoomProvider initiated
  const initialStateActiveRoom = `presence-${userId.user_id}`;
  const initialStateRoomsList: TPrisma_ChatRooms[] = [
    {
      name: "presence-system",
      owner: null,
      users: [userId],
      lastmessage: null,
      state: "success",
    },
    {
      name: `presence-${userId.user_id}`,
      owner: userId,
      users: [userId],
      lastmessage: null,
      state: "success",
    },
  ];

  const [activeRoom, setActiveRoom] = useState<string>(initialStateActiveRoom);
  const [roomsList, dispatchChatRooms] = useReducer(
    roomsListReducer,
    initialStateRoomsList
  );

  // actions
  function getRoomOwnerData(roomName: string) {
    const roomData = roomsList.find((room) => room.name === roomName);
    const roomOwner = roomData ? roomData.owner : null;
    return roomOwner;
  }
  function isOwnerPresent(roomName: string) {
    const roomData = roomsList.find((room) => room.name === roomName);
    const ownerPresent = roomData
      ? roomData.users.findIndex(
          (user) => user.user_id === roomData.owner?.user_id
        ) !== -1
      : null;
    return ownerPresent;
  }
  function getPresentAdmin(roomName: string) {
    const roomData = roomsList.find((room) => room.name === roomName);
    const ownerPresent = roomData
      ? roomData.users.find((user) => user.user_admin)
      : null;
    return ownerPresent;
  }

  // reducers
  function roomsListReducer(
    roomsList: TPrisma_ChatRooms[],
    action: TChatRoomsProviderActions
  ): TPrisma_ChatRooms[] {
    switch (action.type) {
      case "ChatRooms_addNewRoom":
        // adding new room to the state with a precheck that it's not already there
        return roomsList.findIndex((room) => room.name === action.roomName) ===
          -1
          ? [
              ...roomsList,
              {
                name: action.roomName,
                owner: action.owner,
                users: [],
                lastmessage: action.lastmessage,
                state: "loading",
              },
            ]
          : roomsList;
      case "ChatRooms_deleteRoom":
        return roomsList.filter((room) => room.name !== action.roomName);
      case "ChatRooms_setRoomData":
        return roomsList.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                ...action,
              }
            : room
        );
      case "ChatRooms_updateLastmessage":
        return roomsList.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                // comparing room lastmessage with a new lastmessage timestamp
                // saving whichever is older as room.lastmessage
                // if both null saving null
                lastmessage:
                  room.lastmessage && action.lastmessage
                    ? room.lastmessage < action.lastmessage
                      ? action.lastmessage
                      : room.lastmessage
                    : action.lastmessage
                    ? action.lastmessage
                    : room.lastmessage,
              }
            : room
        );
      case "ChatRooms_removeUserFromRoomUsersList":
        return roomsList.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                users: room.users.filter(
                  (user) => user.user_id !== action.user_id
                ),
              }
            : room
        );
      case "ChatRooms_addUserToRoomUsersList":
        // adding user to rooms users list with precheck that it's not already there
        return roomsList.map((room) =>
          room.name === action.roomName
            ? {
                ...room,
                users:
                  room.users.findIndex(
                    (user) => user.user_id === action.user.user_id
                  ) === -1
                    ? [...room.users, action.user]
                    : room.users,
              }
            : room
        );

      default: {
        throw Error("Unknown action: " + JSON.stringify(action));
      }
    }
  }

  return (
    <ChatRoomsContext.Provider
      value={{
        activeRoom,
        setActiveRoom,
        roomsList,
        dispatchChatRooms,
        getRoomOwnerData,
        isOwnerPresent,
        getPresentAdmin,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRoomsContext() {
  const context = useContext(ChatRoomsContext);

  if (!context)
    throw new Error("useChatRoomsContext must be inside ChatRoomsProvider");

  return context;
}
