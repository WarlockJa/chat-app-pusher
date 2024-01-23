import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/ChatDataProvider";
import getUnreadMessages from "@/util/getUnreadMessages";

export default function ChatRooms() {
  // context data
  const { activeRoom, setActiveRoom, roomsList } = useChatRoomsContext();
  const { chatData } = useChatDataContext();

  // switching to the new room
  const handleRoomSwitch = (room: string) => {
    if (activeRoom === room) return;
    setActiveRoom(room);
  };

  // console.log("ChatRooms rerender");

  const content = roomsList
    .sort((a, b) => (a.roomId >= b.roomId ? -1 : 1))
    // hiding rooms system and userId from the list
    // TEST
    // .filter(
    //   (item) =>
    //     item !== "presence-system" && item !== `presence-${userId}`
    // )
    .map((currentRoom) => {
      const unreadMessages = getUnreadMessages({
        chatData: chatData?.find((room) => room.room_id === currentRoom.roomId),
      });
      return (
        <li
          className={
            activeRoom === currentRoom.roomId
              ? "chat__rooms--room chat__rooms--roomActive"
              : "chat__rooms--room"
          }
          key={currentRoom.roomId}
          onClick={() => handleRoomSwitch(currentRoom.roomId)}
        >
          <span>{JSON.stringify(currentRoom.users.length)}</span>{" "}
          {currentRoom.roomId.slice(9)}{" "}
          <span>{unreadMessages > 0 ? unreadMessages.toString() : null}</span>
        </li>
      );
    });

  return <ul className="chat__rooms">{content}</ul>;
}
