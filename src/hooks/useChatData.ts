import { useEffect } from "react";
import type { Message } from "@prisma/client";
import fetchRoomMessages from "@/util/fetchRoomMessages";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";

export default function useChatData() {
  // user data from state
  // const [userId] = useAtom(userIdAtom);
  const { userId } = useUserIdContext();
  // list of rooms
  const { roomsList, activeRoom, setActiveRoom } = useChatRoomsContext();
  // // local chat data
  const { chatData, setChatData } = useChatDataContext();

  const handleNewRoom = ({
    roomId,
    messages,
  }: {
    roomId: string;
    messages: Message[];
  }) => {
    setChatData((prev: IChatData[] | null) =>
      prev ? [...prev, { roomId, messages }] : [{ roomId, messages }]
    );
  };

  useEffect(() => {
    // discarding chat data if user_id no longer present e.g. user logout
    if (!userId?.user_id) {
      setChatData(null);
      return;
    }

    // fetching messages for channels added to roomsList
    roomsList.forEach((channel) => {
      // found room present in roomsList but not in subscriptions
      if (
        !chatData ||
        chatData.findIndex((room) => room.roomId === channel) === -1
      ) {
        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          userId: userId.user_id!,
          room: channel,
          callback: handleNewRoom,
        });
      }
    });
    // removing chat data for channels removed from the roomsList
    // no chat data => nothing to remove
    if (!chatData) return;
    chatData.forEach((chatRoom) => {
      // found chat room that exists in chatData but not in roomsList
      if (roomsList.findIndex((room) => room === chatRoom.roomId) === -1) {
        // changing active room if it is deleted
        if (activeRoom === chatRoom.roomId)
          setActiveRoom(`presence-${userId.user_id}`);
        // removing room from chatData
        setChatData(
          chatData.filter((removeChannel) => chatRoom !== removeChannel)
        );
      }
    });
  }, [userId?.user_id, roomsList.length]);
}
