"use client";
import { pusherClient } from "@/lib/pusher";
import { PresenceChannel } from "pusher-js";
import React, { useEffect, useState } from "react";

interface IChannelsResult {
  channels: { [roomName: string]: {} };
}

export default function ChatRooms({ userId }: { userId: string | null }) {
  const [rooms, setRooms] = useState<string[]>([]);

  // GET room list request
  const getRoomsList = () => {
    fetch("/api/pusher/channels")
      .then((response) => response.json())
      .then((result: IChannelsResult) =>
        setRooms(Object.keys(result.channels))
      );
  };

  // TODO
  // switching to the new room
  const handleRoomSwitch = () => {
    //
  };

  // subscribing to presence-system channel events
  useEffect(() => {
    if (!userId) return;

    // system channel is for admin console notifications
    const channelSystem = pusherClient.subscribe(
      "presence-system"
    ) as PresenceChannel;

    channelSystem.bind("pusher:subscription_succeeded", () => getRoomsList());
    channelSystem.bind("pusher:member_removed", () => {
      console.log(`System Removed`);
      getRoomsList();
    });
    channelSystem.bind("pusher:member_added", () => {
      console.log(`System Added`);
      getRoomsList();
    });

    return () => pusherClient.unsubscribe("presence-system");
  }, [rooms.length, userId]);

  return (
    <ul className="chat__rooms">
      {
        // hiding rooms system and userId from the list
        rooms
          .filter(
            (item) =>
              item !== "presence-system" && item !== `presence-${userId}`
          )
          .map((room) => (
            <li key={room} onClick={handleRoomSwitch}>
              {room.slice(9)}
            </li>
          ))
      }
    </ul>
  );
}
