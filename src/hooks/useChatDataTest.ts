import fetchRoomMessages from "@/util/fetchRoomMessages";
import { Message } from "@prisma/client";
import Pusher from "pusher-js/types/src/core/pusher";
import { useEffect, useState } from "react";

type TChatDataStateLiteral = "loading" | "success" | "error";

export interface IChatData {
  roomId: string;
  messages: Message[];
  state: TChatDataStateLiteral;
  error?: string;
}

export default function useChatData({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: Pusher;
}) {
  // list of rooms
  const [roomsList, setRoomsList] = useState<IRoomsList[]>([
    { roomId: "presence-system", users: [userId.user_id] },
    { roomId: `presence-${userId.user_id}`, users: [userId.user_id] },
  ]);
  // local chat data
  const [chatData, setChatData] = useState<IChatData[]>([]);
  // active room
  const [activeRoom, setActiveRoom] = useState<string>(
    `presence-${userId.user_id}`
  );
  // active room chat data
  const [activeRoomChatData, setActiveRoomChatData] = useState<
    IChatData | undefined
  >();

  const fetchRoomMessagesCallback = (newRoomData: IChatData) => {
    setChatData((prev) => [...prev, newRoomData]);
  };

  useEffect(() => {
    const newActiveChatData = chatData.find(
      (room) => room.roomId === activeRoom
    );
    setActiveRoomChatData(newActiveChatData);
  }, [activeRoom]);

  useEffect(() => {
    console.log("useChatData useEffect");
    // fetching chat data for new rooms
    roomsList.forEach((room) => {
      // new room in roomList not found in chatData
      if (chatData.findIndex((chat) => room.roomId === chat.roomId) === -1) {
        fetchRoomMessages({
          roomId: room.roomId,
          user_id: userId.user_id,
          callback: fetchRoomMessagesCallback,
        });
      }
    });

    return () => console.log("useChatData cleanup");
  }, [roomsList.length]);

  return { activeRoom, setActiveRoom, roomsList, activeRoomChatData };
}
