import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import Avatar from "react-avatar";
import { generateColor } from "@/util/generateColor";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import lastMsgFormatted from "./utils/lastMsgFormatted";
import LoadDBRoomsButton from "./components/LoadDBRoomsButton/LoadDBRoomsButton";
import { Fragment, useRef, useState } from "react";
import DeleteRoomButton from "./components/DeleteRoomButton/DeleteRoomButton";
import SpinnerDots from "@/util/spinners/SpinnerDots";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import OfflineDivider from "./components/OfflineDivider/OfflineDivider";

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
  const { activeRoom, setActiveRoom, roomsList, isOwnerPresent } =
    useChatRoomsContext();
  const { getRoomUnreadMessagesCount } = useChatDataContext();
  const { getRoomTypingUsers } = useUsersTypingContext();
  const { knownUsers_findKnownUser } = useKnownUsersContext();
  // previous room in the list owner present flag
  const previousRoomOwnerPresent = useRef<boolean | null>(null);

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
        item.name !== "presence-system" &&
        (item.owner?.user_id !== user_id || user_admin)
    )
    .sort((a, b) => {
      // sorting by the last message timestamp
      if (!a.lastmessage) return -1;
      if (!b.lastmessage) return 1;
      return a.lastmessage > b.lastmessage ? 1 : -1;
    })
    .sort((a, b) => {
      // sorting again by user online status
      if (!isOwnerPresent(a.name)) return 1;
      if (!isOwnerPresent(b.name)) return -1;

      if (!a.lastmessage) return 1;
      if (!b.lastmessage) return -1;
      return a.lastmessage < b.lastmessage ? 1 : -1;
    })
    .map((currentRoom, index) => {
      const unreadMessagesCount = getRoomUnreadMessagesCount(currentRoom.name);
      // getting room owner data
      // looking up user data from KnownUsers context in case owner data (user_name, user_admin) has changed
      const knownRoomOwner = knownUsers_findKnownUser(
        // owner field is null only for "presence-system" channel which we filtered out earlier
        currentRoom.owner?.user_id!
      );
      const owner = knownRoomOwner ? knownRoomOwner : currentRoom.owner;
      // getting active room typing users data
      const typingUsersData = getRoomTypingUsers(currentRoom.name).users.filter(
        (user) => user !== user_name
      );

      // owner presence flag
      const ownerPresent = isOwnerPresent(currentRoom.name);

      // checking begining of offline users
      let startOffline = false;
      if (previousRoomOwnerPresent.current === true) {
        if (!ownerPresent) {
          startOffline = true;
        }
      }
      previousRoomOwnerPresent.current = ownerPresent;

      return (
        <Fragment key={currentRoom.name}>
          {startOffline && <OfflineDivider />}
          <li
            className={`chat__rooms--room chat__rooms--avatarContainer ${
              !ownerPresent ? "chat__rooms--roomVacant" : ""
            } ${
              activeRoom === currentRoom.name ? "chat__rooms--roomActive" : ""
            }`}
            onClick={() => handleRoomSwitch(currentRoom.name)}
            title={owner?.user_name}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(undefined)}
          >
            <div
              className={
                ownerPresent
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
              !owner?.user_admin && (
                <DeleteRoomButton
                  roomName={currentRoom.name}
                  user_id={user_id}
                  user_admin={user_admin}
                />
              )}
          </li>
        </Fragment>
      );
    });
  return (
    <ul className="chat__rooms">
      {content}
      {user_admin && <LoadDBRoomsButton />}
    </ul>
  );
}
