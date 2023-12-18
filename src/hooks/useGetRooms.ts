import { useState } from "react";

export default function useGetRooms() {
  const [rooms, setRooms] = useState([]);

  fetch("/api/pusher/channels")
    .then((response) => response.json())
    .then((result: IChannelsResult) => {
      callback(Object.keys(result.channels));
    });
}
