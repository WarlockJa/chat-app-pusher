"use client";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { PusherPresence } from "@/context/PusherProvider";
import { useState } from "react";
import "./sendform.scss";
import {
  addChannelMessage,
  updateLastAccessTimestamp,
} from "@/lib/apiDBMethods";
import { sendMessageEvent } from "@/lib/apiPusherMethods";
import { useChatDataContext } from "@/context/ChatDataProvider";

export default function SendForm({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  // console.log("SendForm rerender");

  const { activeRoom } = useChatRoomsContext();
  const [message, setMessage] = useState<string>("");
  const { dispatch: dispatchChatData } = useChatDataContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // generating message uuid to be used in both Pusher message event and written in DB
    // using front-end generation method because it is a faster alternative to
    // DB generation of the message uuid with the following use in Pusher message event
    const messageId = crypto.randomUUID();

    // triggering "message" event for Pusher
    sendMessageEvent({
      message,
      author: userId.user_name,
      activeRoom,
      id: messageId,
    });

    // writing message to DB
    addChannelMessage({
      message,
      userId: userId.user_id,
      room: activeRoom,
      message_id: messageId,
    });

    // Optimistic chat message post. Adding message directly to the local ChatData context.
    // Once received again via Pusher "message" event this message's will be filtered by id
    dispatchChatData({
      type: "addRoomMessages",
      room_id: activeRoom,
      messages: [
        {
          id: messageId,
          text: message,
          author: userId.user_name,
          timestamp: new Date(),
          unread: true,
        },
      ],
    });

    // reset form input value
    setMessage("");
  };

  return (
    <>
      <form className="sendForm" onSubmit={(e) => handleSubmit(e)}>
        <input
          className="sendForm__input"
          type="text"
          name="message"
          id="chat-input"
          value={message}
          maxLength={400}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="sendForm__button"
          type="submit"
          disabled={message === ""}
        >
          Send
        </button>
      </form>
      {/* <button
        onClick={
          // () => console.log(userId.user_admin ? "is admin" : "not admin")
          // () => {
          //   const data = pusher.channel("presence-system");
          //   const members = Object.keys(data.members.members);
          //   const me = pusher.channel("presence-system").members.me;
          //   console.log(me);
          // }
          // () =>
          //   fetch("/api/v1/pusher/system")
          //     .then((response) => response.json())
          //     .then((result) => console.log(result))
          // () => {
          //   console.log(
          //     Object.entries(
          //       pusher.channel(`presence-${userId.user_id}`).members
          //         .members as IChannelMembers
          //     ).map(([user_id, user_info]) => ({
          //       user_id,
          //       user_name: user_info.user_name,
          //       user_admin: user_info.user_admin,
          //     }))
          //   );
          // }
          // () =>
          //   updateLastAccessTimestamp({
          //     user_id: userId.user_id,
          //     channel_name: "presence-WJ",
          //   })
          // () => {
          //   fetch(
          //     `api/v1/db/messages/history?channel_name=presence-WJ&user_id=WJ`
          //   )
          //     .then((response) => response.json())
          //     .then((result) => console.log(result));
          // }
          // () => {
          //   fetch(
          //     `api/v1/db/messages/new?channel_name=presence-Mike&user_id=Mike`
          //   )
          //     .then((response) => response.json())
          //     .then((result) => console.log(result));
          // }
          () => console.log(navigator.onLine)
        }
      >
        TEST
      </button> */}
    </>
  );
}
