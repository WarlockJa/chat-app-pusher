import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import getTypingUsersString from "@/util/getTypingUsersString";
import lastMsgFormatted from "./utils/lastMsgFormatted";

export default function ChatRooms({
  user_name,
  user_id,
  user_admin,
}: {
  user_name: string;
  user_id: string;
  user_admin: boolean;
}) {
  // context data
  const {
    activeRoom,
    setActiveRoom,
    roomsList,
    getRoomOwnerData,
    isOwnerPresent,
  } = useChatRoomsContext();
  const { getRoomUnreadMessagesCount, getRoomLastMessageTimestamp } =
    useChatDataContext();
  const { getRoomTypingUsers } = useUsersTypingContext();

  // switching to the new room
  const handleRoomSwitch = (newActiveRoom: string) => {
    // changing activeRoom
    if (activeRoom === newActiveRoom) return;
    setActiveRoom(newActiveRoom);
  };
  // console.log("ChatRooms rerender");

  const content = roomsList
    // hiding rooms system and userId from the list
    // filtering out presence-system
    .filter(
      (item) =>
        item.roomId !== "presence-system" &&
        (item.owner?.user_id !== user_id || user_admin)
    )
    .map((currentRoom) => {
      const unreadMessagesCount = getRoomUnreadMessagesCount(
        currentRoom.roomId
      );
      // getting room owner data
      const owner = getRoomOwnerData(currentRoom.roomId);
      const lastMsgTimestamp = getRoomLastMessageTimestamp(currentRoom.roomId);
      // getting active room typing users data
      const data = getRoomTypingUsers(currentRoom.roomId);
      const roomTypingUsersString = getTypingUsersString({ data, user_name });
      return (
        <li
          className={
            activeRoom === currentRoom.roomId
              ? "chat__rooms--room chat__rooms--roomActive chat__rooms--avatarContainer"
              : "chat__rooms--room chat__rooms--avatarContainer"
          }
          key={currentRoom.roomId}
          onClick={() => handleRoomSwitch(currentRoom.roomId)}
          title={owner?.user_name}
        >
          <div
            className={
              isOwnerPresent(currentRoom.roomId)
                ? "chat__rooms--ownerPresence chat__rooms--ownerPresenceOn"
                : "chat__rooms--ownerPresence"
            }
          ></div>
          <Avatar
            name={owner?.user_name}
            round
            size="2em"
            textSizeRatio={2}
            color={generateColor(owner?.user_name)}
          />
          <div className="chat__rooms--userName chat__rooms--mobileHidden">
            {owner?.user_name}
          </div>
          {lastMsgTimestamp ? (
            <div className="chat__rooms--lastMsgTimestamp chat__rooms--mobileHidden">
              {lastMsgFormatted(lastMsgTimestamp)}
            </div>
          ) : null}
          {unreadMessagesCount > 0 ? (
            <div className="chat__rooms--unreadMsgsIndicator">
              <span>{unreadMessagesCount.toString()}</span>
            </div>
          ) : null}
          {/* TODO add some spinner */}
          {roomTypingUsersString ? (
            <div className="chat__rooms--typingIndicator chat__rooms--mobileHidden">
              {roomTypingUsersString}
            </div>
          ) : null}
        </li>
      );
    });
  return <ul className="chat__rooms">{content}</ul>;
}
