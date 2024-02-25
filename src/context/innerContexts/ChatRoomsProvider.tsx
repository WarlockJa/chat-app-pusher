import { createContext, useContext, useReducer, useState } from "react";

export interface IChatRoomsSetRoomData {
  type: "setRoomData";
  room_id: string;
  owner?: IUserId;
  state?: TChatDataStateLiteral;
}

type TChatRoomsProviderActions =
  | { type: "addNewRoom"; room_id: string }
  | { type: "removeRoom"; room_id: string }
  | IChatRoomsSetRoomData
  | { type: "removeUserFromRoomUsersList"; user_id: string; room_id: string }
  | { type: "addUserToRoomUsersList"; user: IUserId; room_id: string };

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
      state: "success",
    },
    {
      roomId: `presence-${userId.user_id}`,
      owner: userId,
      users: [userId],
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
      case "addNewRoom":
        // adding new room to the state with a precheck that it's not already there
        return roomsList.findIndex((room) => room.roomId === action.room_id) ===
          -1
          ? [
              ...roomsList,
              {
                roomId: action.room_id,
                owner: null,
                users: [],
                state: "loading",
              },
            ]
          : roomsList;
      case "removeRoom":
        return roomsList.filter((room) => room.roomId !== action.room_id);
      case "setRoomData":
        return roomsList.map((room) =>
          room.roomId === action.room_id
            ? {
                ...room,
                ...action,
              }
            : room
        );
      case "removeUserFromRoomUsersList":
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
      case "addUserToRoomUsersList":
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
