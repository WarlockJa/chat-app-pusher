import {
  IChatData,
  TChatDataStateLiteral,
  useChatDataContext,
} from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import fetchRoomMessages from "@/util/fetchRoomMessages";
import { Message } from "@prisma/client";
import { useEffect } from "react";

export default function useChatData({ userId }: { userId: IUserId }) {
  // list of rooms
  const { roomsList } = useChatRoomsContext();
  // local chat data
  const { chatData, setChatData } = useChatDataContext();

  // handleNewRoom used as a callback for a DB POST request that searches for a room
  // with roomId and returns messages array or null if room is not found
  const handleNewRoom = ({
    roomId,
    messages,
    state,
  }: {
    roomId: string;
    messages: Message[] | null;
    state: TChatDataStateLiteral;
  }) => {
    setChatData((prev: IChatData[] | null) =>
      prev
        ? [
            ...prev.filter((room) => room.roomId !== roomId),
            { roomId, messages: messages ? messages : [], state },
          ]
        : [{ roomId, messages: messages ? messages : [], state }]
    );
  };

  useEffect(() => {
    const { user_id } = userId;

    roomsList.forEach((room) => {
      // found room present in roomsList but not in subscriptions
      if (
        !chatData ||
        chatData.findIndex((chatRoom) => chatRoom.roomId === room.roomId) === -1
      ) {
        setChatData((prev) =>
          prev
            ? [...prev, { roomId: room.roomId, messages: [], state: "loading" }]
            : [{ roomId: room.roomId, messages: [], state: "loading" }]
        );
        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          user_id: user_id,
          roomId: room.roomId,
          callback: handleNewRoom,
        });
      }
    });

    // removing chat data for channels removed from the roomsList
    // no chat data => nothing to remove
    if (!chatData) return;
    chatData.forEach((chatRoom) => {
      // removing room from chatData
      setChatData(
        chatData.filter((removeChannel) => chatRoom !== removeChannel)
      );
    });

    return () => setChatData(null);
  }, [roomsList.length]);
}
