import { createContext, useContext, useReducer, useState } from "react";

type IChatRoomsProviderActions =
  | { type: "addRoom"; newRoom: IChatRoom }
  | { type: "getRoomsList" };

interface IChatRoomsContext {
  activeRoom: string;
  setActiveRoom: (newActiveRooms: string) => void;

  roomsList: IChatRoom[];
  // dispatch: (action: IChatRoomsProviderActions) =>

  setRoomsList: (
    newRoomsList: ((prev: IChatRoom[]) => IChatRoom[]) | IChatRoom[]
  ) => void;
  // getRoomMembers: (roomId: string) => IUserId[];
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
      users: [userId],
    },
    {
      roomId: `presence-${userId.user_id}`,
      users: [userId],
    },
  ];

  // TODO add methods to RoomsList context with useReducer to add/remove users, rooms...
  // https://react.dev/learn/managing-state
  const [activeRoom, setActiveRoom] = useState<string>(initialStateActiveRoom);
  const [roomsList, setRoomsList] = useState<IChatRoom[]>(
    initialStateRoomsList
  );
  // const [roomsList, dispatch] = useReducer(
  //   roomsListReducer,
  //   initialStateRoomsList
  // );

  // function roomsListReducer(
  //   roomsList: IChatRoom[],
  //   action: IChatRoomsProviderActions
  // ) {
  //   switch (action.type) {
  //     case "addRoom":
  //       return [...roomsList, action.newRoom];
  //     case "getRoomsList":
  //       return roomsList

  //     default: {
  //       throw Error('Unknown action: ' + JSON.stringify(action));
  //     }
  //   }
  // }

  return (
    <ChatRoomsContext.Provider
      value={{
        activeRoom,
        setActiveRoom,
        roomsList,
        // dispatch
        // roomsList,
        setRoomsList,
        // getRoomMembers,
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
