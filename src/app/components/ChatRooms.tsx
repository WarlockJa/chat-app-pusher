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

  console.log("ChatRooms rerender");

  const content = roomsList
    .sort((a, b) => (a.roomId >= b.roomId ? -1 : 1))
    // hiding rooms system and userId from the list
    // TEST
    // .filter(
    //   (item) =>
    //     item !== "presence-system" && item !== `presence-${userId}`
    // )
    .map((room) => (
      <li
        className={
          activeRoom === room.roomId
            ? "chat__rooms--room chat__rooms--roomActive"
            : "chat__rooms--room"
        }
        key={room.roomId}
        onClick={() => handleRoomSwitch(room.roomId)}
      >
        {room.roomId.slice(9)}
      </li>
    ));

  return <ul className="chat__rooms">{content}</ul>;
}
