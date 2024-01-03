import { IChatData } from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";

// adds a new message to the room
export const addMessage = (room: IChatData, message: Message): IChatData => {
  return {
    roomId: room.roomId,
    messages: [...room.messages, message],
  };
};
