import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./typingnotifications.scss";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
export default function TypingNotifications() {
  const { activeRoom } = useChatRoomsContext();
  const { getRoomTypingUsers } = useUsersTypingContext();

  // getting active room typing users data
  const data = getRoomTypingUsers(activeRoom);

  // forming output string
  const typingUsers: string = data.users.reduce(
    (users, user, index) => users.concat(index === 0 ? `${user}` : `, ${user}`),
    ""
  );

  const content =
    typingUsers !== ""
      ? data.users.length === 1
        ? `${typingUsers} is typing...`
        : `${typingUsers} are typing...`
      : "";

  return <div className="typingUsers">{content}</div>;
}
