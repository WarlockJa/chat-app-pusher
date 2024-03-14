import { createContext, useContext, useReducer, useState } from "react";

export interface IChatRoomsSetRoomData {
  type: "ChatRooms_setRoomData";
  room_id: string;
  owner?: IUserId;
  state?: TChatDataStateLiteral;
  lastmessage?: Date | null;
}

export interface IChatRoomsAddNewRoom {
  type: "ChatRooms_addNewRoom";
  room_id: string;
  owner: IUserId;
  lastmessage: Date | null;
}

type TChatRoomsProviderActions =
  | IChatRoomsAddNewRoom
  | { type: "ChatRooms_deleteRoom"; room_id: string }
  | IChatRoomsSetRoomData
  | {
      type: "ChatRooms_removeUserFromRoomUsersList";
      user_id: string;
      room_id: string;
    }
  | {
      type: "ChatRooms_addUserToRoomUsersList";
      user: IUserId;
      room_id: string;
    };

interface IChatRoomsContext {
  activeRoom: string;
  setActiveRoom: (newActiveRooms: string) => void;

  roomsList: IChatRoom[];
  dispatchChatRooms: (action: TChatRoomsProviderActions) => void;
  getRoomOwnerData: (room_id: string) => IUserId | null;
  isOwnerPresent: (room_id: string) => boolean | null;
  getPresentAdmin: (room_id: string) => IUserId | undefined | null;
}

const ChatRoomsContext = createContext<IChatRoomsContext | null>(null);

export function ChatRoomsProvider({
  children,
  userId,
}: {
  children: React.ReactNode | undefined;
  userId: IUserId;
}) {
  // reading userId from higher level UserIdProvider context.
  // in this app userId will always be populated when ChatRoomProvider initiated
  const initialStateActiveRoom = `presence-${userId.user_id}`;
  const initialStateRoomsList: IChatRoom[] = [
    {
      roomId: "presence-system",
      owner: null,
      users: [userId],
      lastmessage: null,
      state: "success",
    },
    {
      roomId: `presence-${userId.user_id}`,
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
  function getRoomOwnerData(room_id: string) {
    const roomData = roomsList.find((room) => room.roomId === room_id);
    const roomOwner = roomData ? roomData.owner : null;
    return roomOwner;
  }
  function isOwnerPresent(room_id: string) {
    const roomData = roomsList.find((room) => room.roomId === room_id);
    const ownerPresent = roomData
      ? roomData.users.findIndex(
          (user) => user.user_id === roomData.owner?.user_id
        ) !== -1
      : null;
    return ownerPresent;
  }
  function getPresentAdmin(room_id: string) {
    const roomData = roomsList.find((room) => room.roomId === room_id);
    const ownerPresent = roomData
      ? roomData.users.find((user) => user.user_admin)
      : null;
    return ownerPresent;
  }

  // reducers
  function roomsListReducer(
    roomsList: IChatRoom[],
    action: TChatRoomsProviderActions
  ): IChatRoom[] {
    switch (action.type) {
      case "ChatRooms_addNewRoom":
        // adding new room to the state with a precheck that it's not already there
        return roomsList.findIndex((room) => room.roomId === action.room_id) ===
          -1
          ? [
              ...roomsList,
              {
                roomId: action.room_id,
                owner: action.owner,
                users: [],
                lastmessage: action.lastmessage,
                state: "loading",
              },
            ]
          : roomsList;
      case "ChatRooms_deleteRoom":
        return roomsList.filter((room) => room.roomId !== action.room_id);
      case "ChatRooms_setRoomData":
        return roomsList.map((room) =>
          room.roomId === action.room_id
            ? {
                ...room,
                ...action,
              }
            : room
        );
      case "ChatRooms_removeUserFromRoomUsersList":
        return roomsList.map((room) =>
          room.roomId === action.room_id
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
          room.roomId === action.room_id
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
