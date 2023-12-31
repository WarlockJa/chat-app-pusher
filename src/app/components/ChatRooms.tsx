import { useChatRoomsContext } from "@/context/ChatRoomsProvider";

interface IChannelsResult {
  channels: { [roomName: string]: {} };
}

const getRoomsList = (callback: (rooms: string[]) => void) => {
  fetch("/api/pusher/channels")
    .then((response) => response.json())
    .then((result: IChannelsResult) => {
      callback(Object.keys(result.channels));
    });
};

export default function ChatRooms() {
  // context data
  const { activeRoom, setActiveRoom, roomsList } = useChatRoomsContext();

  // switching to the new room
  const handleRoomSwitch = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
  };

  return (
    <ul className="chat__rooms">
      {
        // hiding rooms system and userId from the list
        roomsList
          // TEST
          // .filter(
          //   (item) =>
          //     item !== "presence-system" && item !== `presence-${userId}`
          // )
          .map((room) => (
            <li
              className="chat__rooms--room"
              key={room}
              onClick={() => handleRoomSwitch(room)}
            >
              {room.slice(9)}
            </li>
          ))
      }
    </ul>
  );
}
