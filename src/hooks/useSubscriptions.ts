import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";
import fetchRoomMessages from "@/util/fetchRoomMessages";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // pusher connection instance
  const { pusher } = usePusherContext();
  // state data
  const { userId } = useUserIdContext();
  // list of rooms
  const { roomsList, activeRoom, setActiveRoom } = useChatRoomsContext();
  // local chat data
  const { chatData, setChatData } = useChatDataContext();

  // cleanup subscriptions function
  const handleUnsubscribeAllChannels = () => {
    subscriptions.forEach((channel) => channel.unsubscribe());
    setSubscriptions([]);
  };

  // handleNewRoom used as a callback for a DB POST request that searches for a room
  // with roomId and returns messages array or null if room is not found
  const handleNewRoom = ({
    roomId,
    messages,
  }: {
    roomId: string;
    messages: Message[] | null;
  }) => {
    setChatData((prev: IChatData[] | null) =>
      prev
        ? [...prev, { roomId, messages: messages ? messages : [] }]
        : [{ roomId, messages: messages ? messages : [] }]
    );
  };

  const addMessage = (room: IChatData, message: string): IChatData => {
    return {
      roomId: room.roomId,
      messages: [
        ...room.messages,
        { author: "TEST", readusers: [], text: message, timestamp: new Date() },
      ],
    };
  };

  // TODO uncluster this
  useEffect(() => {
    // processing user logout
    if (!userId?.user_id) {
      handleUnsubscribeAllChannels();
      return;
    }

    if (!pusher) return;

    // TODO move useChatData here
    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found room present in roomsList but not in subscriptions
      if (
        !chatData ||
        chatData.findIndex((chatRoom) => chatRoom.roomId === room) === -1
      ) {
        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          userId: userId.user_id!,
          room,
          callback: handleNewRoom,
        });
      }

      // found room present in roomsList but not in subscriptions
      if (subscriptions.findIndex((channel) => channel.name === room) === -1) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room) as PresenceChannel;
        setSubscriptions((prev) => [...prev, newChannel]);

        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          userId: userId.user_id!,
          room,
          callback: handleNewRoom,
        });

        newChannel.bind("message", function (data: IMessageData) {
          setChatData((prev) =>
            prev
              ? [
                  ...prev.filter((currentRoom) => currentRoom.roomId !== room),
                  addMessage(
                    prev.find((currentRoom) => currentRoom.roomId === room)!,
                    data.message
                  ),
                ]
              : [addMessage({ roomId: room, messages: [] }, data.message)]
          );
        });
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (roomsList.findIndex((room) => room === channel.name) === -1) {
        // unsubscribing from channel modifying subscriptions state
        channel.unsubscribe();
        setSubscriptions((prev) =>
          prev.filter((removeChannel) => channel !== removeChannel)
        );
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

    return () => handleUnsubscribeAllChannels();
  }, [roomsList.length, userId?.user_id, pusher]);

  return { subscriptions };
}
