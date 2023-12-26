import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { PresenceChannel } from "pusher-js";
import React, { useEffect } from "react";

// interface IChatRoomsProps {
//   userId: string | null;
//   activeRoom: string;
//   setActiveRoom: (activeRoom: string) => void;
// }
interface IChannelsResult {
  channels: { [roomName: string]: {} };
}

const getRoomsList = (callback: (rooms: string[]) => void) => {
  fetch("/api/pusher/channels")
    .then((response) => response.json())
    .then((result: IChannelsResult) => {
      callback(Object.keys(result.channels));
    });
};

export default function ChatRooms() {
  // context data
  const { userId } = useUserIdContext();
  const { activeRoom, setActiveRoom, roomsList, setRoomsList } =
    useChatRoomsContext();
  const { pusher } = usePusherContext();

  // switching to the new room
  const handleRoomSwitch = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
  };

  // subscribing to presence-system channel events
  useEffect(() => {
    if (!pusher) return;
    // TODO just running build
    if (!userId?.user_id) return;

    // system channel is for admin console notifications
    console.log("ChatRooms - useEffect");
    const channelSystem = pusher.subscribe(
      "presence-system"
    ) as PresenceChannel;
    // subscribing to user channel
    const userChannel = pusher.subscribe(`presence-${userId.user_id}`);
    userChannel.bind("message", (data: IMessageData) => {
      // TODO add message to chataData state
    });

    // binding admin to presence-system channel events
    if (userId.user_admin) {
      channelSystem.bind("pusher:subscription_succeeded", () => {
        getRoomsList(setRoomsList);
      });
      channelSystem.bind("pusher:member_removed", () => {
        console.log(`System Removed`);
        getRoomsList(setRoomsList);
      });
      channelSystem.bind("pusher:member_added", () => {
        console.log(`System Added`);
        getRoomsList(setRoomsList);
      });
    }

    return () => {
      if (!pusher) return;
      console.log("Cleanup system");
      pusher.unsubscribe("presence-system");
    };
  }, [pusher]);

  return (
    <ul className="chat__rooms">
      {
        // hiding rooms system and userId from the list
        roomsList
          // TEST
          // .filter(
          //   (item) =>
          //     item !== "presence-system" && item !== `presence-${userId}`
          // )
          .map((room) => (
            <li
              className="chat__rooms--room"
              key={room}
              onClick={() => handleRoomSwitch(room)}
            >
              {room.slice(9)}
            </li>
          ))
      }
    </ul>
  );
}
