"use client";
import {
  activeRoomAtom,
  roomsListAtom,
  userChannelAtom,
  userIdAtom,
} from "@/lib/localState";
import { useAtom } from "jotai";
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

// export default function ChatRooms(props: IChatRoomsProps) {
export default function ChatRooms() {
  // jotai state data
  const [userId] = useAtom(userIdAtom);
  const [activeRoom, setActiveRoom] = useAtom(activeRoomAtom);
  const [roomsList, setRoomsList] = useAtom(roomsListAtom);
  const [userChannel] = useAtom(userChannelAtom);

  // switching to the new room
  const handleRoomSwitch = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
  };

  // useEffect(() => {
  //   // system channel is for admin console notifications
  //   setChannelSystem(
  //     pusherClient.subscribe("presence-system") as PresenceChannel
  //   );

  //   getRoomsList(setRoomsList);

  //   return () => pusherClient.unsubscribe("presence-system");
  // }, []);

  // subscribing to presence-system channel events
  useEffect(() => {
    if (!userChannel) return;

    // system channel is for admin console notifications
    console.log("ChatRooms - useEffect");
    // const channelSystem = pusherClient(userId.user_id).subscribe(
    //   "presence-system"
    // ) as PresenceChannel;
    userChannel.subscribe("presence-system") as PresenceChannel;

    // binding admin to presence-system channel events
    if (userId.user_admin) {
      userChannel.bind("pusher:subscription_succeeded", () => {
        // console.log("system subscribtion");
        getRoomsList(setRoomsList);
        // fetch("/api/pusher/channels")
        //   .then((response) => response.json())
        //   .then((result: IChannelsResult) => {
        //     console.log("system subscribtion");
        //     setRoomsList(Object.keys(result.channels));
        //   });
      });
      userChannel.bind("pusher:member_removed", () => {
        console.log(`System Removed`);
        getRoomsList(setRoomsList);
      });
      userChannel.bind("pusher:member_added", () => {
        console.log(`System Added`);
        getRoomsList(setRoomsList);
      });
    }

    return () => {
      if (!userChannel) return;
      console.log("Cleanup system");
      userChannel.unsubscribe("presence-system");
    };
  }, [userChannel, roomsList.length]);

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
