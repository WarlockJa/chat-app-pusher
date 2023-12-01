"use client";
import { pusherClient } from "@/lib/pusher";
import { PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";

export default function ChatBody({ userId }: { userId: string | null }) {
  const [messages, setMessages] = useState<string[]>([
    "Please enter your name",
  ]);

  useEffect(() => {
    if (!userId) return;
    // TODO add loading animation flag
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
      .then(
        (result) =>
          result
            ? setMessages([
                ...result.messages.messages.map((message) => message.text),
              ])
            : console.log("")
        // console.log(result)
      );
    setMessages([`Welcome to chat ${userId}`]);
  }, [userId]);

  useEffect(() => {
    console.log("Messages useEffect");
    // subscribing to the presence channel with the name based on the userId
    const channel = pusherClient.subscribe(
      `presence-${userId}`
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
      fetch("/api/db", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: data.message,
          userId,
        }),
      });
      // adding message to the state
      setMessages([...messages, data.message]);
    });

    // channel.bind("pusher:subscription_succeeded", () =>
    //   console.log(channel.members)
    // );
    // channel.bind("pusher:member_added", () => console.log(channel.members));
    // channel.bind("pusher:member_removed", () => console.log(channel.members));

    return () => {
      pusherClient.unsubscribe(`presence-${userId}`);
      pusherClient.unsubscribe("system");
    };
  }, [messages]);

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
