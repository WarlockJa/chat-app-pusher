import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import useSWRImmutable from "swr/immutable";

export default function ChatBody() {
  const { activeRoom } = useChatRoomsContext();
  // const { chatData } = useChatDataContext();
  // const activeRoomChatData = chatData?.find(
  //   (item) => item.roomId === activeRoom
  // );

  const { data, isLoading, error } = useSWRImmutable<IChatData>(
    `/api/v1/db?roomId=${activeRoom}`
  );

  // console.log("ChatBody rerender");
  // let chatContent;
  // if (!activeRoomChatData || activeRoomChatData.state === "loading") {
  //   chatContent = "Loading..."; // TODO replace with spinner
  // } else if (activeRoomChatData?.state === "error") {
  //   chatContent = activeRoomChatData.error;
  // } else
  //   chatContent = activeRoomChatData
  //     ? activeRoomChatData.messages.map((msg, index) => (
  //         <li key={index} className="post__text">
  //           {msg.text}
  //         </li>
  //       ))
  //     : null;
  let chatContent;
  if (isLoading) {
    chatContent = "Loading..."; // TODO replace with spinner
  } else if (error) {
    chatContent = error;
  } else
    chatContent = data
      ? data.messages.map((msg, index) => (
          <li key={index} className="post__text">
            {msg.text}
          </li>
        ))
      : null;
  return (
    <div className="chat__body">
      <ul className="chat-display">{chatContent}</ul>
    </div>
  );
}
