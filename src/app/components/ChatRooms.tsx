import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import "./chatrooms.scss";

export default function ChatRooms() {
  // context data
  const { activeRoom, setActiveRoom, roomsList } = useChatRoomsContext();

  // switching to the new room
  const handleRoomSwitch = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
  };

  // console.log("ChatRooms rerender");

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
              className={
                activeRoom === room.roomName
                  ? "chat__rooms--room chat__rooms--roomActive"
                  : "chat__rooms--room"
              }
              key={room.roomName}
              onClick={() => handleRoomSwitch(room.roomName)}
            >
              {room.roomName.slice(9)}
            </li>
          ))
      }
    </ul>
  );
}
