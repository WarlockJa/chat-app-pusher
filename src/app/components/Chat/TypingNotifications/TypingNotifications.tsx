import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./typingnotifications.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
export default function TypingNotifications() {
  // TODO this will rerender every time chatData changes
  // we need to do something
  const { activeRoom } = useChatRoomsContext();
  const { chatData } = useChatDataContext();

  // getting active room chat data
  const chatData_ActiveRoom = chatData?.find(
    (room) => room.room_id === activeRoom
  );

  if (!chatData_ActiveRoom) return;

  const typingUsers: string = chatData_ActiveRoom.typing.reduce(
    (users, user, index) => users.concat(index === 0 ? `${user}` : `, ${user}`),
    ""
  );

  const content =
    typingUsers !== ""
      ? chatData_ActiveRoom.typing.length === 1
        ? `${typingUsers} is typing...`
        : `${typingUsers} are typing...`
      : "";

  return <div className="typingUsers">{content}</div>;
}
