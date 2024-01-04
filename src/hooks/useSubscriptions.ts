import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { Message } from "@prisma/client";
import fetchRoomMessages from "@/util/fetchRoomMessages";
import { getRoomsList } from "@/util/getRoomsList";
import { addMessage } from "@/util/addMessage";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // pusher connection instance
  const { pusher } = usePusherContext();
  // state data
  const { userId } = useUserIdContext();
  // list of rooms
  const { roomsList, setRoomsList, activeRoom, setActiveRoom } =
    useChatRoomsContext();
  // local chat data
  const { chatData, setChatData } = useChatDataContext();

  // cleanup subscriptions function
  const handleCleanup = () => {
    subscriptions.forEach((channel) => channel.unsubscribe());
    setSubscriptions([]);
    setChatData(null);
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

  // fetching new rooms if member_added triggered on presence-system channel from administrator
  // TODO check if true
  // only processing adding rooms because even when user leaves administrator is still subscribed
  const refreshRoomsList = (newRoomsArray: string[]) => {
    // newRoomsArray.forEach((newRoom) => {
    //   if (roomsList.findIndex((room) => room.roomName === newRoom) === -1)
    //     setRoomsList((prev) => [...prev, { users: [], roomName: newRoom }]);
    // });
    const result = newRoomsArray.map((item) => {
      return { users: [], roomName: item };
    });
    setRoomsList(result);
  };

  // TODO uncluster this
  useEffect(() => {
    // processing user logout
    if (!userId?.user_id) {
      handleCleanup();
      return;
    }

    if (!pusher) return;

    const { user_id, user_admin } = userId;

    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found room present in roomsList but not in subscriptions
      // TODO check if duplicates fetching from subscriptions
      if (
        !chatData ||
        chatData.findIndex((chatRoom) => chatRoom.roomId === room.roomName) ===
          -1
      ) {
        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          userId: user_id,
          room: room.roomName,
          callback: handleNewRoom,
        });
      }

      // found subscription channel present in roomsList but not in subscriptions
      if (
        subscriptions.findIndex((channel) => channel.name === room.roomName) ===
        -1
      ) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room.roomName) as PresenceChannel;
        setSubscriptions((prev) => [...prev, newChannel]);

        // if user is not an administrator no further interactions with presence-system required
        if (room.roomName === "presence-system" && !user_admin) return;

        // fetching room data from DB and storing it in chatData
        fetchRoomMessages({
          userId: user_id,
          room: room.roomName,
          callback: handleNewRoom,
        });

        newChannel.bind("message", function (data: IMessageData) {
          setChatData((prev) =>
            prev
              ? [
                  ...prev.filter(
                    (currentRoom) => currentRoom.roomId !== room.roomName
                  ),
                  addMessage(
                    prev.find(
                      (currentRoom) => currentRoom.roomId === room.roomName
                    )!,
                    {
                      author: user_id,
                      readusers: [user_id],
                      text: data.message,
                      timestamp: new Date(),
                    }
                  ),
                ]
              : [
                  addMessage(
                    { roomId: room.roomName, messages: [] },
                    {
                      author: user_id,
                      readusers: [user_id],
                      text: data.message,
                      timestamp: new Date(),
                    }
                  ),
                ]
          );
        });

        // member_added and member_removed binds used to update number of users on the channel
        // i.e. allows to monitor if admin/user is present
        newChannel.bind(
          "pusher:member_added",
          (data: { id: string; info: string | undefined }) => {
            // update users on the channel number

            // updating rooms list on member_added. Not updated on member_removed because administrator is still subscribed
            if (room.roomName === "presence-system") {
              console.log("RoomsList: ", roomsList);
              // method .bind preserves the state of the app at the moment of its call
              // therefore we have to call prev when modifying state inside the .bind
              setRoomsList((prev) => {
                return prev.findIndex((room) => room.roomName === data.id) ===
                  -1
                  ? [...prev, { users: [], roomName: `presence-${data.id}` }]
                  : prev;
              });
              // if (
              //   roomsList.findIndex((room) => room.roomName === data.id) === -1
              // )
              //   setRoomsList(() => [
              //     ...roomsList,
              //     { users: [], roomName: `presence-${data.id}` },
              //   ]);
            }
          }
        );

        newChannel.bind("pusher:member_removed", () => {
          // update users on the channel number
        });

        // assigning additional bindings for presence-system for the administrator
        if (room.roomName !== "presence-system") return;

        // fetching list of currently active user rooms upon initial load
        newChannel.bind("pusher:subscription_succeeded", () => {
          getRoomsList(refreshRoomsList);
        });
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (
        roomsList.findIndex((room) => room.roomName === channel.name) === -1
      ) {
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
      if (
        roomsList.findIndex((room) => room.roomName === chatRoom.roomId) === -1
      ) {
        // changing active room if it is deleted
        if (activeRoom === chatRoom.roomId)
          setActiveRoom(`presence-${userId.user_id}`);
        // removing room from chatData
        setChatData(
          chatData.filter((removeChannel) => chatRoom !== removeChannel)
        );
      }
    });

    return () => {
      handleCleanup();
    };
  }, [roomsList.length, userId?.user_id, pusher]);
}
