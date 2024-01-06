import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { useChatDataContext } from "@/context/ChatDataProvider";
import { getRoomsList } from "@/util/getRoomsList";
import { addMessage } from "@/util/addMessage";
import Pusher from "pusher-js/types/src/core/pusher";

// this hook tracks changes in roomsList and adjusts pusher subscriptions
// according to access role of the user
export default function useSubscriptions({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: Pusher;
}) {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // list of rooms
  const { roomsList, setRoomsList } = useChatRoomsContext();
  // local chat data
  const { setChatData } = useChatDataContext();

  // cleanup subscriptions function
  const handleCleanup = () => {
    console.log("Subscriptions cleanup");
    subscriptions.forEach((channel) => channel.unsubscribe());
    setSubscriptions([]);
  };

  // fetching new rooms if member_added triggered on presence-system channel from administrator
  // TODO check if true
  // only processing adding rooms because even when user leaves administrator is still subscribed
  const refreshRoomsList = (newRoomsArray: string[]) => {
    const result = newRoomsArray.map((item) => {
      return { users: [userId.user_id], roomId: item };
    });
    console.log("Fetched roomslist: ", result);
    setRoomsList(result);
  };

  // TODO uncluster this
  useEffect(() => {
    const { user_id, user_admin } = userId;

    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found subscription channel present in roomsList but not in subscriptions
      if (
        subscriptions.findIndex((channel) => channel.name === room.roomId) ===
        -1
      ) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room.roomId) as PresenceChannel;
        setSubscriptions((prev) => [...prev, newChannel]);

        // if user is not an administrator no further interactions with presence-system required
        if (room.roomId === "presence-system" && !user_admin) return;

        newChannel.bind("message", function (data: IMessageData) {
          setChatData((prev) =>
            prev
              ? [
                  ...prev.filter(
                    (currentRoom) => currentRoom.roomId !== room.roomId
                  ),
                  addMessage(
                    prev.find(
                      (currentRoom) => currentRoom.roomId === room.roomId
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
                    { roomId: room.roomId, messages: [], state: "success" },
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
            console.log("Channel bind");

            // updating rooms list on member_added. Not updated on member_removed because administrator is still subscribed
            if (room.roomId === "presence-system") {
              console.log("RoomsList: ", roomsList);
              // method .bind preserves the state of the app at the moment of its call
              // therefore we have to call prev when modifying state inside the .bind
              setRoomsList((prev) => {
                console.log(prev);
                return prev.findIndex((room) => room.roomId === data.id) === -1
                  ? [...prev, { users: [], roomId: `presence-${data.id}` }]
                  : prev;
              });
            }
          }
        );

        newChannel.bind("pusher:member_removed", () => {
          // update users on the channel number
        });

        // assigning additional bindings for presence-system for the administrator
        if (room.roomId !== "presence-system") return;

        // fetching list of currently active user rooms upon initial load
        newChannel.bind("pusher:subscription_succeeded", () => {
          console.log("Channel name: ", newChannel.name);
          // TEST
          getRoomsList(refreshRoomsList);
        });
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (roomsList.findIndex((room) => room.roomId === channel.name) === -1) {
        // unsubscribing from channel modifying subscriptions state
        channel.unsubscribe();
        setSubscriptions((prev) =>
          prev.filter((removeChannel) => channel !== removeChannel)
        );
      }
    });

    return () => {
      handleCleanup();
    };
  }, [roomsList.length]);
}
