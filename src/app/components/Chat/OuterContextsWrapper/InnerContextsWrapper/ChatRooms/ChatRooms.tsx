import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
import { formatDistanceToNowStrict } from "date-fns";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import getTypingUsersString from "@/util/getTypingUsersString";

export default function ChatRooms({
  user_name,
  user_id,
}: {
  user_name: string;
  user_id: string;
}) {
  // context data
  const { activeRoom, setActiveRoom, roomsList, getRoomOwnerData } =
    useChatRoomsContext();
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
    // TEST
    // filtering out presence-system
    .filter((item) => item.roomId !== "presence-system")
    .map((currentRoom) => {
      const unreadMessagesCount = getRoomUnreadMessagesCount(
        currentRoom.roomId
      );
      // TEST
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
        >
          {/* TODO replace name with Room Owner data*/}
          <div className="chat__rooms--ownerPresence"></div>
          <Avatar
            name={currentRoom.roomId.slice(9)}
            round
            size="2em"
            textSizeRatio={2}
            color={generateColor(currentRoom.roomId.slice(9))}
          />
          {/* <span>{JSON.stringify(currentRoom.users.length)}</span>{" "} */}
          {/* {currentRoom.roomId.slice(9)} TODO get last seen timestamp */}
          {owner?.user_name}
          {lastMsgTimestamp ? (
            <div className="chat__rooms--lastMsgTimestamp">
              {formatDistanceToNowStrict(
                // overriding TS warning because we're already checking unreadMessagesCount
                lastMsgTimestamp
              )}{" "}
              ago
            </div>
          ) : null}
          {unreadMessagesCount > 0 ? (
            <div className="chat__rooms--unreadMsgsIndicator">
              <span>{unreadMessagesCount.toString()}</span>
            </div>
          ) : null}
          {/* TODO add some spinner */}
          {roomTypingUsersString ? (
            <div className="chat__rooms--typingIndicator">
              {roomTypingUsersString}
            </div>
          ) : null}
        </li>
      );
    });
  return (
    <ul className="chat__rooms">
      <li className="chat__rooms__header chat__rooms--avatarContainer">
        <Avatar name={user_name} round size="3em" textSizeRatio={2} />
        <p className="chat__rooms__header--userName" title={user_name}>
          {user_name}
        </p>
      </li>
      {content}
    </ul>
  );
}
