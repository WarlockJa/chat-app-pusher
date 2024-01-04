import { Message } from "@prisma/client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface IChatData {
  roomId: string;
  messages: Message[];
}

interface IChatDataContext {
  chatData: IChatData[] | null;
  setChatData: (
    newChatData:
      | ((prev: IChatData[] | null) => IChatData[] | null) // figuring out this type took a while
      | IChatData[]
      | null
  ) => void;
}

// make useReducer context? https://react.dev/learn/managing-state
const ChatDataContext = createContext<IChatDataContext | null>(null);

export function ChatDataProvider({ children }: PropsWithChildren<{}>) {
  const [chatData, setChatData] = useState<IChatData[] | null>(null);

  return (
    <ChatDataContext.Provider value={{ chatData, setChatData }}>
      {children}
    </ChatDataContext.Provider>
  );
}

export function useChatDataContext() {
  const context = useContext(ChatDataContext);

  if (!context) {
    throw new Error("useChatDataContext must be inside ChatDataProvider");
  }

  return context;
}
