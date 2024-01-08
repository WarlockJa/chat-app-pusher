"use client";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Pusher from "pusher-js/types/src/core/pusher";
import { useState } from "react";

export default function SendForm({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: Pusher;
}) {
  // console.log("SendForm rerender");

  const { activeRoom } = useChatRoomsContext();
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO get types from back-end into front-end somewhow. tRPC?

    // triggering "message" event for Pusher
    fetch("/api/v1/pusher/message", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        message,
        activeRoom,
      }),
    });

    // TODO change message data
    // writing message to DB
    fetch("/api/v1/db", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        message,
        userId: userId.user_id,
        room: activeRoom,
      }),
    })
      .then((response) => response.json())
      .then((test) => console.log(test));

    setMessage("");
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          name="message"
          id="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <button
        onClick={
          () => {
            const data = pusher.channel("presence-system");
            const members = Object.keys(data.members.members);
            console.log(members);
          }
          // () =>
          //   fetch("/api/v1/pusher/channels")
          //     .then((response) => response.json())
          //     .then((result) => console.log(result))
        }
      >
        TEST
      </button>
    </div>
  );
}
