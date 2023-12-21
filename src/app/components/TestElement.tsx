"use client";
import { useEffect, useState } from "react";
import "./chat.scss";
import { PresenceChannel } from "pusher-js";
import { useAtom } from "jotai";
import { pusherAtom } from "@/lib/localState";

export default function TestElement() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [pusher] = useAtom(pusherAtom);
  // TEST
  const [test, setTest] = useState<string[]>([]);

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
    // const channel = pusherClient("WJ");
    if (!pusher) return;
    console.log("connection");

    const channel = pusher.subscribe(`presence-WJ`) as PresenceChannel;

    channel.bind("message", function (data: { message: string }) {
      // adding message to the state
      setMessages((prev) => [...prev, data.message]);
    });

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("subscription_succeeded");
      setMessages((prev) => [...prev, "subscription_succeeded"]);
    });
    channel.bind("pusher:member_added", () => {
      console.log("Member added");
      setMessages((prev) => [...prev, "Member added"]);
    });
    channel.bind("pusher:member_removed", () => {
      console.log("Member removed");
      setMessages((prev) => [...prev, "Member removed"]);
    });

    return () => {
      console.log("Cleanup TEST");
      pusher.unsubscribe("WJ");
    };
  }, [pusher]);

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
