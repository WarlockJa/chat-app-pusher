import { PropsWithChildren, createContext, useContext, useState } from "react";

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

export function ChatRoomsProvider({ children }: PropsWithChildren<{}>) {
  const [activeRoom, setActiveRoom] = useState<string>("");
  const [roomsList, setRoomsList] = useState<IRoomsList[]>([]);

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
