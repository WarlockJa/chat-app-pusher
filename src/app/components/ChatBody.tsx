"use client";
import { pusherClient } from "@/lib/pusher";
import type { channel } from "@prisma/client";
import { useAtom } from "jotai";
import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { activeRoomAtom, userIdAtom } from "./Chat";

export default function ChatBody() {
  const [messages, setMessages] = useState<string[]>([
    "Please enter your name",
  ]);
  // jotai state data
  const [userId] = useAtom(userIdAtom);
  const [activeRoom] = useAtom(activeRoomAtom);

  // loading room messages history from DB
  useEffect(() => {
    if (!userId) return;

    fetch("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        activeRoom,
      }),
    })
      .then((response) => response.json())
      .then((result: channel) => {
        result?.messages
          ? setMessages(() => [
              ...result.messages.map((message) => message.text),
              `Welcome to chat ${userId}`,
            ])
          : setMessages([`Welcome to chat ${userId}`]);
      });
  }, [userId, activeRoom]);

  useEffect(() => {
    if (!userId || !activeRoom) return;
    console.log("Messages useEffect");
    // subscribing to the presence channel with the name based on the userId
    const channel = pusherClient.subscribe(
      // `presence-${userId}`
      activeRoom
    ) as PresenceChannel;

    // pusherClient.bind_global((eventName, data) => {
    //   console.log(
    //     `bind global: The event ${eventName} was triggered with data ${JSON.stringify(
    //       data
    //     )}`
    //   );
    // });

    channel.bind("message", function (data: { message: string }) {
      // adding message to the state
      console.log(messages);
      setMessages(() => [...messages, data.message]);
    });

    // return () => pusherClient.unsubscribe(`presence-${userId}`);
    return () => {
      console.log("Cleanup " + activeRoom);
      pusherClient.unsubscribe(activeRoom);
    };
  }, [userId, messages, activeRoom]);

  const chatContent = messages.map((msg, index) => (
    <li key={index} className="post__text">
      {msg}
    </li>
  ));

  return (
    <div className="chat__body">
      <ul className="chat-display">{chatContent}</ul>
    </div>
  );
}
