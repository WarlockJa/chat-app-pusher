import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { useState } from "react";

export default function SendForm() {
  const [message, setMessage] = useState<string>("");
  const { userId } = useUserIdContext();
  const { activeRoom } = useChatRoomsContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO get types from back-end into front-end somewhow. tRPC?

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
    fetch("/api/db", {
      method: "PUT",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({
        message,
        userId: userId?.user_id,
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
    </div>
  );
}
