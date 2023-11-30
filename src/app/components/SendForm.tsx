"use client";
import { useState } from "react";

export default function SendForm({
  userId,
  setUserId,
}: {
  userId: string | null;
  setUserId: (value: string) => void;
}) {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      setUserId(message);
      document.cookie = "user_id=" + message;
    } else {
      fetch("/api/pusher/message", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          message,
          user_id: userId,
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
