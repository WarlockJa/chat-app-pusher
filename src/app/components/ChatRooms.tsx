import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/ChatDataProvider";

export default function ChatRooms() {
  // context data
  const { activeRoom, setActiveRoom, roomsList } = useChatRoomsContext();
  const { chatData } = useChatDataContext();

  // switching to the new room
  const handleRoomSwitch = (newActiveRoom: string) => {
    // changing activeRoom
    if (activeRoom === newActiveRoom) return;
    setActiveRoom(newActiveRoom);
  };
  // console.log("ChatRooms rerender");

  const content = roomsList
    // hiding rooms system and userId from the list
    // TEST
    // .filter(
    //   (item) =>
    //     item !== "presence-system" && item !== `presence-${userId}`
    // )
    .map((currentRoom) => {
      // chatData ? chatData.messages.filter((msg) => msg.unread).length : 0;
      const roomChatData = chatData?.find(
        (room) => room.room_id === currentRoom.roomId
      );
      const unreadMessagesCount = roomChatData
        ? roomChatData.messages.filter((msg) => msg.unread).length
        : 0;
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
          <span>
            {unreadMessagesCount > 0 ? unreadMessagesCount.toString() : null}
          </span>
        </li>
      );
    });
  return <ul className="chat__rooms">{content}</ul>;
}
