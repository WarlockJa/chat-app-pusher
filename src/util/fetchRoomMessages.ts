"use client";
import type { Message, channel } from "@prisma/client";

interface IFetchRoomMessagesProps {
  userId: string;
  room: string;
  callback: ({
    roomId,
    messages,
  }: {
    roomId: string;
    messages: Message[];
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
      callback({ roomId: room, messages: result?.messages })
    )
    .catch((error) => callback(error));
}
