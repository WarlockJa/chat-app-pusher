"use client";
import { useEffect, useRef, useState } from "react";
import "./chat.scss";
import { pusherClient } from "@/lib/pusher";
import { PresenceChannel } from "pusher-js";

export default function TestElement() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");

  //   const [channel, setChannel] = useState(
  //     pusherClient("WJ").subscribe(`presence-WJ`)
  //   );
  //   const subscriptionFlag = useRef<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString();

    if (!message) return;

    // triggering "message" event for Pusher
    fetch("/api/pusher/message", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        message,
        activeRoom: "presence-WJ",
      }),
    });
  };

  useEffect(() => {
    const channel = pusherClient("WJ").subscribe(
      `presence-WJ`
    ) as PresenceChannel;

    channel.bind("message", function (data: { message: string }) {
      // adding message to the state
      setMessages((prev) => [...prev, data.message]);
    });

    return () => {
      console.log("Cleanup TEST");
      pusherClient("WJ").unsubscribe("WJ");
    };
  }, []);

  const content = messages.map((msg, index) => (
    <li key={index} className="post__text">
      {msg}
    </li>
  ));

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__body">
          <ul className="chat-display">{content}</ul>
        </div>
        <div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="message"
              id="chat-input"
              maxLength={20}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
