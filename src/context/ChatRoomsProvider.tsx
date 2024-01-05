import { createContext, useContext, useState } from "react";

interface IRoomsList {
  roomId: string;
  users: string[];
}

interface IChatRoomsContext {
  activeRoom: string;
  roomsList: IRoomsList[];
  setActiveRoom: (newActiveRooms: string) => void;
  setRoomsList: (
    newRoomsList: ((prev: IRoomsList[]) => IRoomsList[]) | IRoomsList[]
  ) => void;
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
  const initialStateRoomsList = [
    { roomId: "presence-system", users: [userId.user_id] },
    { roomId: `presence-${userId.user_id}`, users: [userId.user_id] },
  ];

  const [activeRoom, setActiveRoom] = useState<string>(initialStateActiveRoom);
  const [roomsList, setRoomsList] = useState<IRoomsList[]>(
    initialStateRoomsList
  );

  return (
    <ChatRoomsContext.Provider
      value={{ activeRoom, setActiveRoom, roomsList, setRoomsList }}
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
