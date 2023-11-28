"use client";
import { useState } from "react";

const URL = "http://localhost:3000/api/pusher/";

export default function SendForm() {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(message),
    });

    // fetch(URL)
    //   .then((response) => response.json())
    //   .then((result) => console.log(result));

    setMessage("");
  };

  const handleGetInfoClick = () => {
    fetch(URL)
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
