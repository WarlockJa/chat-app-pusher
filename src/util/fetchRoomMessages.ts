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
    .then((response) => response.json())
    .then((result: channel) =>
      callback({ roomId: room, messages: result?.messages })
    );
}
