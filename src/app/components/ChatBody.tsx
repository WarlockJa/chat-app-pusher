"use client";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

export default function ChatBody({ userId }: { userId: string | null }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    userId
      ? setMessages([`Welcome to chat ${userId}`])
      : setMessages(["Please enter your name"]);
  }, [userId]);

  useEffect(() => {
    // const channel = pusher.subscribe("presence-quickstart");
    const channel = pusherClient.subscribe("presence-chat");
    channel.bind("message", function (data: { message: string }) {
      setMessages([...messages, data.message]);
    });

    // channel.bind("pusher:subscription_succeeded", () => console.log(channel));

    return () => pusherClient.unsubscribe("presence-chat");
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
