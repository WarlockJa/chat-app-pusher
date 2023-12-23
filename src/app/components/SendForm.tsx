"use client";
import { activeRoomAtom, roomsListAtom, userIdAtom } from "@/lib/localState";
import { useAtom } from "jotai";
import { useState } from "react";

export default function SendForm() {
  const [message, setMessage] = useState<string>("");
  // jotai state data
  const [userId] = useAtom(userIdAtom);
  const [activeRoom] = useAtom(activeRoomAtom);
  // TEST
  const [roomsList, setRoomsList] = useAtom(roomsListAtom);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // triggering "message" event for Pusher
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

    // TODO change message data
    // writing message to DB
    // fetch("/api/db", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "Application/json",
    //   },
    //   body: JSON.stringify({
    //     message,
    //     userId,
    //     activeRoom,
    //   }),
    // });

    setMessage("");
  };

  const handleGetInfoClick = () => {
    fetch("/api/pusher/channels")
      .then((response) => response.json())
      .then((result) =>
        roomsList.length === 0
          ? setRoomsList(Object.keys(result.channels))
          : setRoomsList([])
      );
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
