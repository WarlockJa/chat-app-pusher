import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import lastMsgFormatted from "./utils/lastMsgFormatted";
import LoadDBRoomsButton from "./components/LoadDBRoomsButton";
import { useState } from "react";
import DeleteRoomButton from "./components/DeleteRoomButton";
import SpinnerDots from "@/util/spinners/SpinnerDots";

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
  const { getRoomUnreadMessagesCount } = useChatDataContext();
  const { getRoomTypingUsers } = useUsersTypingContext();

  // switching to the new room
  const handleRoomSwitch = (newActiveRoom: string) => {
    // changing activeRoom
    if (activeRoom === newActiveRoom) return;
    setActiveRoom(newActiveRoom);
  };
  // hovered item index
  const [hoverIndex, setHoverIndex] = useState<number | undefined>(undefined);

  // console.log("ChatRooms rerender");

  const content = roomsList
    // hiding rooms system and userId from the list
    // filtering out presence-system
    .filter(
      (item) =>
        item.roomId !== "presence-system" &&
        (item.owner?.user_id !== user_id || user_admin)
    )
    // sorting by the last message timestamp
    .sort((a, b) => {
      if (!a.lastmessage) return 1;
      if (!b.lastmessage) return -1;
      return a.lastmessage < b.lastmessage ? 1 : -1;
    })
    .map((currentRoom, index) => {
      const unreadMessagesCount = getRoomUnreadMessagesCount(
        currentRoom.roomId
      );
      // getting room owner data
      const owner = getRoomOwnerData(currentRoom.roomId);
      // getting active room typing users data
      const typingUsersData = getRoomTypingUsers(
        currentRoom.roomId
      ).users.filter((user) => user !== user_name);
      // const roomTypingUsersString = getTypingUsersString({ data, user_name });
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
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(undefined)}
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
          {currentRoom.lastmessage ? (
            <div className="chat__rooms--lastMsgTimestamp chat__rooms--mobileHidden">
              {lastMsgFormatted(currentRoom.lastmessage)}
            </div>
          ) : null}
          {unreadMessagesCount > 0 ? (
            <div className="chat__rooms--unreadMsgsIndicator">
              <span>{unreadMessagesCount.toString()}</span>
            </div>
          ) : null}
          {typingUsersData.length > 0 ? (
            <div className="chat__rooms--typingIndicator">
              <SpinnerDots />
              <span className="chat__rooms--mobileHidden">&nbsp;typing</span>
            </div>
          ) : null}
          {hoverIndex === index &&
            user_admin &&
            currentRoom.users.length === 1 &&
            !currentRoom.owner?.user_admin && (
              <DeleteRoomButton
                room_id={currentRoom.roomId}
                user_id={user_id}
              />
            )}
        </li>
      );
    });
  return (
    <ul className="chat__rooms">
      {content}
      {user_admin && <LoadDBRoomsButton />}
    </ul>
  );
}
