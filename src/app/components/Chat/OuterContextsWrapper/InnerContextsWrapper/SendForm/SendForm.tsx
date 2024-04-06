"use client";
import { useState } from "react";
import "./sendform.scss";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import ArrowRight from "@/assets/svg/ArrowRight";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { apiPusher_sendTypingEvent } from "@/lib/apiPusherMethods/apiPusher_sendTypingEvent";
import { apiDB_addChannelMessage } from "@/lib/apiDBMethods/apiDB_addChannelMessage";
import { apiPusher_sendMessageEvent } from "@/lib/apiPusherMethods/apiPusher_sendMessageEvent";

export default function SendForm({ userId }: { userId: TPrisma_User }) {
  // console.log("SendForm rerender");

  const { activeRoom } = useChatRoomsContext();
  const [message, setMessage] = useState<string>("");
  const { dispatchChatData } = useChatDataContext();
  const { dispatchChatRooms } = useChatRoomsContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // generating message uuid to be used in both Pusher message event and written in DB
    // using front-end generation method because it is a faster alternative to
    // DB generation of the message uuid with the following use in Pusher message event
    const message_id = crypto.randomUUID();

    // triggering "message" event for Pusher
    apiPusher_sendMessageEvent({
      body: {
        message,
        author: userId.user_id,
        channel_name: activeRoom,
        message_id,
      },
      accessToken: { user_id: userId.user_id, user_admin: userId.user_admin },
    });

    // writing message to DB
    apiDB_addChannelMessage({
      body: {
        message_text: message,
        author: userId.user_id,
        channel_name: activeRoom,
        message_id,
      },
      accessToken: { user_id: userId.user_id, user_admin: userId.user_admin },
    });

    // Optimistic chat message post. Adding message directly to the local ChatData context.
    const messageTimestamp = new Date().toISOString();
    // Once received again via Pusher "message" event this message's will be filtered by id
    dispatchChatData({
      type: "addRoomMessages",
      roomName: activeRoom,
      messages: [
        {
          id: message_id,
          text: message,
          author: userId.user_id,
          timestamp: messageTimestamp,
          unread: true, // default state is unread for scroll events
        },
      ],
    });

    // updating lastmessage field in ChatRooms context for the room
    dispatchChatRooms({
      type: "ChatRooms_setRoomData",
      roomName: activeRoom,
      lastmessage: messageTimestamp,
    });

    // reset form input value
    setMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // changing local state inut value
    setMessage(e.target.value);

    // triggering "typing" event for Pusher
    apiPusher_sendTypingEvent({
      body: {
        author: userId.user_name,
        channel_name: activeRoom,
      },
      accessToken: { user_id: userId.user_id, user_admin: userId.user_admin },
    });
  };

  return (
    <form className="sendForm" onSubmit={(e) => handleSubmit(e)}>
      <input
        className="sendForm__input"
        type="text"
        name="message"
        id="chat-input"
        value={message}
        maxLength={400}
        onChange={(e) => handleChange(e)}
      />
      <button
        className="sendForm__button"
        type="submit"
        disabled={message === ""}
      >
        <ArrowRight />
      </button>
    </form>
  );
}
