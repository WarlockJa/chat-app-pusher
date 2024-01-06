import { IChatData } from "@/context/ChatDataProvider";
import type { channel } from "@prisma/client";

interface IFetchRoomMessagesProps {
  user_id: string;
  roomId: string;
  callback: (newRoomData: IChatData) => void;
}

// helper function that retrieves array of room messages from DB
export default function fetchRoomMessages({
  user_id,
  roomId,
  callback,
}: IFetchRoomMessagesProps) {
  if (!user_id || !roomId || !callback) return;

  fetch("/api/v1/db", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
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
      callback({ roomId: roomId, messages: result?.messages, state: "success" })
    )
    .catch((error) =>
      callback({
        roomId: roomId,
        messages: [],
        state: "error",
        error: JSON.stringify(error),
      })
    );
}
