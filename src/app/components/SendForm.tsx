"use client";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import { PusherPresence } from "@/context/PusherProvider";
import { useState } from "react";
import "./sendform.scss";
import { schemaApiDBPOST } from "@/lib/validators";
import { z } from "zod";
import { updateLastAccessTimestamp } from "@/lib/dbMethods";

// TODO get types from back-end zod schema into front-end
// type schemaPOST = z.infer<typeof schemaApiDBPOST>;
type schemaDBPost = z.infer<typeof schemaApiDBPOST>;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const messagePostBody: IMessagePOST = {
      message,
      author: userId.user_name,
      activeRoom,
    };

    // triggering "message" event for Pusher
    fetch("/api/v1/pusher/message", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(messagePostBody),
    });

    const dbPostBody: schemaDBPost = {
      message,
      userId: userId.user_id,
      room: activeRoom,
    };

    // TODO change message data
    // writing message to DB
    fetch("/api/v1/db", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(dbPostBody),
    })
      .then((response) => response.json())
      .then((test) => console.log(test));

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
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendForm__button" type="submit">
          Send
        </button>
      </form>
      <button
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
          () =>
            updateLastAccessTimestamp({
              user_id: userId.user_id,
              channel_name: "presence-WJ",
            })
        }
      >
        TEST
      </button>
    </>
  );
}
