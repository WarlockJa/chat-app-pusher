"use client";
import { useState } from "react";
import "./sendform.scss";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import ArrowRight from "@/assets/svg/ArrowRight";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { apiPusher_sendTypingEvent } from "@/lib/apiPusherMethods/apiPusher_sendTypingEvent";
import { apiDB_addChannelMessage } from "@/lib/apiDBMethods/apiDB_addChannelMessage";
import { apiPusher_sendMessageEvent } from "@/lib/apiPusherMethods/apiPusher_sendMessageEvent";

export default function SendForm({
  userId,
  pusher,
}: {
  userId: TPrisma_User;
  pusher: PusherPresence;
}) {
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
    // TODO check if Pusher needs full userId token for message event
    apiPusher_sendMessageEvent({
      message,
      author: userId.user_id,
      activeRoom,
      id: message_id,
    });

    // writing message to DB
    apiDB_addChannelMessage({
      message_text: message,
      author: userId.user_id,
      channel_name: activeRoom,
      message_id,
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
      author: userId.user_name,
      activeRoom,
    });
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
          () => {
            console.log();
          }
        }
      >
        TEST
      </button> */}
    </>
  );
}
