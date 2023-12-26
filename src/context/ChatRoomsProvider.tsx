import { PropsWithChildren, createContext, useContext, useState } from "react";

interface IChatRoomsContext {
  activeRoom: string;
  roomsList: string[];
  setActiveRoom: (newActiveRooms: string) => void;
  setRoomsList: (newRoomsList: string[]) => void;
}

const ChatRoomsContext = createContext<IChatRoomsContext | null>(null);

export function ChatRoomsProvider({ children }: PropsWithChildren<{}>) {
  const [activeRoom, setActiveRoom] = useState<string>("");
  const [roomsList, setRoomsList] = useState<string[]>([]);

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
