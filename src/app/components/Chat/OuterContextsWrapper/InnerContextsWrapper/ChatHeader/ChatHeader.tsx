import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatheader.scss";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
import SpinnerDots from "@/util/spinners/SpinnerDots";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import getTypingUsersString from "./utils/getTypingUsersString";
export default function ChatHeader({
  user_name,
  user_admin,
}: {
  user_name: string;
  user_admin: boolean;
}) {
  const { activeRoom } = useChatRoomsContext();
  const { getRoomTypingUsers } = useUsersTypingContext();
  const { getRoomOwnerData, getPresentAdmin, isOwnerPresent } =
    useChatRoomsContext();

  // getting room owner data
  const owner = getRoomOwnerData(activeRoom);
  // getting active room typing users data
  const data = getRoomTypingUsers(activeRoom);
  const usersTyping = getTypingUsersString({ data, user_name });
  // getting channel owner data from KnownUsers context
  const { knownUsers_findKnownUser } = useKnownUsersContext();

  // if user is an administrator displaying room owner data
  // otherwise displaying administrator data
  const headerUserData = user_admin
    ? // owner field is null only for "presence-system" channel which we filtered out earlier
      knownUsers_findKnownUser(owner?.user_id!)?.user_name
    : // TODO show active administrator somehow?
      getPresentAdmin(activeRoom)?.user_name;
  // const headerUserData = user_admin
  //   ? owner?.user_name
  //   : getPresentAdmin(activeRoom)?.user_name;

  return (
    <div className="chatHeader">
      <Avatar
        name={headerUserData}
        round
        size="4em"
        textSizeRatio={2}
        color={generateColor(headerUserData)}
      />
      <p className="chatHeader--roomOwnerName">{headerUserData}</p>
      <div
        className={
          user_admin
            ? isOwnerPresent(activeRoom)
              ? "chatHeader__ownerPresence chatHeader__ownerPresenceOn"
              : "chatHeader__ownerPresence"
            : headerUserData
            ? "chatHeader__ownerPresence chatHeader__ownerPresenceOn"
            : "chatHeader__ownerPresence"
        }
      ></div>
      {/* TODO add some spinner */}
      {usersTyping ? (
        <div className="chatHeader--typingIndicator">
          {usersTyping}&nbsp;
          <SpinnerDots />
        </div>
      ) : null}
    </div>
  );
}
