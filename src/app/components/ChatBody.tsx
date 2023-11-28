"use client";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  forceTLS: true,
  //   channelAuthorization: {
  //     transport: "ajax",
  //     endpoint: "http://localhost:3000/api/pusher/auth",
  //   },
  //   userAuthentication: {
  //     endpoint: "http://localhost:3000/api/pusher/auth",
  //     transport: "ajax",
  //     params: {},
  //     headers: {},
  //   },
});

if (!document.cookie.match("(^|;) ?user_id=([^;]*)(;|$)")) {
  // Primitive authorization! This 'user_id' cookie is read by your authorization endpoint,
  // and used as the user_id in the subscription to the 'presence-quickstart'
  // channel. This is then displayed to all users in the user list.
  // In your production app, you should use a secure authorization system.
  document.cookie = "user_id=" + prompt("Your initials:");
}

export default function ChatBody() {
  const [messages, setMessages] = useState<string[]>([]);
  //   const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    // const channel = pusher.subscribe("presence-quickstart");
    const channel = pusher.subscribe("my-channel");
    channel.bind("message", function (data: { message: string }) {
      setMessages([...messages, data.message]);
    });

    channel.bind("pusher:subscription_succeeded", () => console.log(channel));

    return () => pusher.unsubscribe("my-channel");
  }, [messages]);

  const chatContent = messages.map((msg, index) => (
    <li key={index} className="post__text">
      {msg}
    </li>
  ));

  return (
    <div>
      <ul className="chat-display">{chatContent}</ul>
    </div>
  );
}
