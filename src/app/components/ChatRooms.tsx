import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import "./chatrooms.scss";
import { useChatDataContext } from "@/context/ChatDataProvider";
import getUnreadMessagesCount from "@/util/getUnreadMessagesCount";
import { getChannelHistoryMessages } from "@/lib/apiDBMethods";

// TODO delete
// const handleNewActiveRoom = ({
//   newActiveRoom,
//   user_id,
// }: {
//   newActiveRoom: string;
//   user_id: string;
// }) => {
//   const { chatData, dispatch: dispatchChatData } = useChatDataContext();
//   // if entering room for the first time loading chat history page
//   const newActiveRoomChatData = chatData?.find(
//     (room) => room.room_id === newActiveRoom
//   );
//   if (!newActiveRoomChatData) return;

//   // checking if new active room had had its first history data page loaded
//   if (newActiveRoomChatData.pagination.firstEntry) {
//     console.log(newActiveRoomChatData.pagination.firstEntry);
//     // changing firstEntry flag for the new active room
//     dispatchChatData({
//       type: "setPaginationFirstEntry",
//       room_id: newActiveRoom,
//       newFirstEntry: false,
//     });
//     // fetching messages from DB
//     getChannelHistoryMessages({
//       params: { channel_name: newActiveRoom, user_id },
//       dispatchChatData,
//     });
//   }
// };

export default function ChatRooms({ user_id }: { user_id: string }) {
  // context data
  const { activeRoom, setActiveRoom, roomsList } = useChatRoomsContext();
  const { chatData, dispatch: dispatchChatData } = useChatDataContext();

  // switching to the new room
  const handleRoomSwitch = (newActiveRoom: string) => {
    // changing activeRoom
    if (activeRoom === newActiveRoom) return;
    setActiveRoom(newActiveRoom);

    // TODO replace with pagination marker history load
    // // if entering room for the first time loading chat history page
    // const newActiveRoomChatData = chatData?.find(
    //   (room) => room.room_id === newActiveRoom
    // );
    // if (!newActiveRoomChatData) return;

    // // checking if new active room had had its first history data page loaded
    // if (newActiveRoomChatData.pagination.firstEntry) {
    //   // changing firstEntry flag for the new active room
    //   dispatchChatData({
    //     type: "setPaginationFirstEntry",
    //     room_id: newActiveRoom,
    //     newFirstEntry: false,
    //   });
    //   // fetching messages from DB
    //   getChannelHistoryMessages({
    //     params: { channel_name: newActiveRoom, user_id },
    //     dispatchChatData,
    //   });
    // }
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
      const unreadMessages = getUnreadMessagesCount({
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
