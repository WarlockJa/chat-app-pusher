"use client";
import { pusherClient } from "@/lib/pusher";
import type { channel } from "@prisma/client";
import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";

export default function ChatBody({ userId }: { userId: string | null }) {
  const [messages, setMessages] = useState<string[]>([
    "Please enter your name",
  ]);

  // loading messages history from DB
  useEffect(() => {
    if (!userId) return;
    // TODO move to server component
    fetch("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    })
      .then((response) => response.json())
      .then((result: channel) => {
        result.messages
          ? setMessages(() => [
              ...result.messages.map((message) => message.text),
              `Welcome to chat ${userId}`,
            ])
          : setMessages([`Welcome to chat ${userId}`]);
      });
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    console.log("Messages useEffect");
    // subscribing to the presence channel with the name based on the userId
    const channel = pusherClient.subscribe(
      `presence-${userId}`
      // `presence-temp`
    ) as PresenceChannel;

    // pusherClient.bind_global((eventName, data) => {
    //   console.log(
    //     `bind global: The event ${eventName} was triggered with data ${JSON.stringify(
    //       data
    //     )}`
    //   );
    // });

    channel.bind("message", function (data: { message: string }) {
      // TODO move DB API calls somewhere
      // writing message to DB
      // fetch("/api/db", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     message: data.message,
      //     userId,
      //   }),
      // });
      // adding message to the state
      console.log(messages);
      setMessages(() => [...messages, data.message]);
    });

    // channel.bind("pusher:subscription_succeeded", () =>
    //   console.log(channel.members)
    // );
    // channel.bind("pusher:member_added", () => {
    //   setTest((test) => !test);
    //   console.log("Member added ", channel.members);
    // });
    // channel.bind("pusher:member_removed", () => {
    //   setTest((test) => !test);
    //   console.log("Member removed ", channel.members);
    // });

    return () => pusherClient.unsubscribe(`presence-${userId}`);
    // return () => pusherClient.unsubscribe("presence-temp");
    // }, [messages, test]);
  }, [userId, messages]);

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
