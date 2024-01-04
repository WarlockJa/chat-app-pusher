"use client";
import { TChatDataStateLiteral } from "@/context/ChatDataProvider";
import type { Message, channel } from "@prisma/client";

interface IFetchRoomMessagesProps {
  userId: string;
  room: string;
  callback: ({
    roomId,
    messages,
    state,
  }: {
    roomId: string;
    messages: Message[];
    state: TChatDataStateLiteral;
  }) => void;
}

// helper function that retreieves array of room messages from DB
export default function fetchRoomMessages({
  userId,
  room,
  callback,
}: IFetchRoomMessagesProps) {
  if (!userId || !room || !callback) return;

  fetch("/api/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      room,
    }),
  })
    .then((response) => {
      if (response.ok) return response.json();
      if (response.status === 400)
        throw new Error(
          // `Error fetching room data: ${JSON.stringify(response.json())}`,
          `Error fetching room data: ${JSON.stringify(response)}`,
          { cause: "Invalid request data" }
        );
      throw new Error(
        `Error fetching room data: ${JSON.stringify(response.json())}`,
        { cause: "Error fetching database data" }
      );
    })
    .then((result: channel) =>
      callback({ roomId: room, messages: result?.messages, state: "success" })
    )
    .catch((error) =>
      callback({
        roomId: room,
        messages: [
          {
            text: JSON.stringify(error),
            author: "system",
            timestamp: new Date(),
            readusers: [userId],
          },
        ],
        state: "error",
      })
    );
}
