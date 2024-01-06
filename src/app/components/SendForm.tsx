"use client";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { useState } from "react";

export default function SendForm({ userId }: { userId: IUserId }) {
  // console.log("SendForm rerender");

  const { activeRoom, setActiveRoom } = useChatRoomsContext();
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
      method: "PUT",
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
        onClick={() =>
          activeRoom === "presence-system"
            ? setActiveRoom("presence-WJ")
            : setActiveRoom("presence-system")
        }
      >
        TEST
      </button>
    </div>
  );
}
