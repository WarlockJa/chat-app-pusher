import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatheader.scss";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import getTypingUsersString from "@/util/getTypingUsersString";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
export default function ChatHeader({
  user_id,
  user_name,
}: {
  user_id: string;
  user_name: string;
}) {
  const { activeRoom } = useChatRoomsContext();
  const { getRoomTypingUsers } = useUsersTypingContext();

  // getting active room typing users data
  // TODO replace with channel owner data
  const data = getRoomTypingUsers(activeRoom);
  const usersTyping = getTypingUsersString({ data, user_id });

  return (
    <div className="chatHeader">
      <Avatar
        name={user_name}
        round
        size="4em"
        textSizeRatio={2}
        color={generateColor(user_name)}
      />
      <p className="chatHeader--roomOwnerName">{user_name}</p>
      <div className="chatHeader__ownerPresence"></div>
      {/* TODO add some spinner */}
      {usersTyping ? (
        <div className="chatHeader--typingIndicator">{usersTyping}</div>
      ) : null}
    </div>
  );
}
