"use client";
import { useAtom } from "jotai";
import { useState } from "react";
import { activeRoomAtom, userIdAtom } from "./Chat";

export default function SendForm() {
  const [message, setMessage] = useState<string>("");
  // jotai state data
  const [userId, setUserId] = useAtom(userIdAtom);
  const [activeRoom, setActiveRoom] = useAtom(activeRoomAtom);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      // TODO validate input
      // writing new user_id to a cookie
      setUserId(message);
      setActiveRoom(`presence-${message}`);
      document.cookie = "user_id=" + message;
    } else {
      fetch("/api/pusher/message", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          message,
          activeRoom,
        }),
      });

      fetch("/api/db", {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          message,
          userId,
          activeRoom,
        }),
      });
    }

    // fetch(URL)
    //   .then((response) => response.json())
    //   .then((result) => console.log(result));

    setMessage("");
  };

  const handleGetInfoClick = () => {
    fetch("/api/pusher/channels")
      .then((response) => response.json())
      .then((result) => console.log(result));
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
      <button onClick={() => handleGetInfoClick()}>Get Info</button>
    </div>
  );
}
