import React from "react";

interface IRooms {
  name: string;
}

export default function ChatRooms({ rooms }: { rooms: IRooms[] }) {
  return (
    <ul className="chat__rooms">
      {rooms.map((room) => (
        <li key={room.name}>{room.name}</li>
      ))}
    </ul>
  );
}
