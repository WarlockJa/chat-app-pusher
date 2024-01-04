"use client";
import { useEffect, useState } from "react";
import "./chat.scss";
import { PresenceChannel } from "pusher-js";
import { usePusherContext } from "@/context/PusherProvider";
import fetchRoomMessages from "@/util/fetchRoomMessages";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { addMessage } from "@/util/addMessage";
import { useUserIdContext } from "@/context/UserIdProvider";

export default function TestElement() {
  const { chatData, setChatData } = useChatDataContext();
  const [message, setMessage] = useState<string>("");
  const { userId } = useUserIdContext();
  console.log("TEST rerender");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message")?.toString();

    setChatData(message);
  };
  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__body">
          <ul className="chat-display">{`${chatData} - ${userId?.user_id}`}</ul>
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
