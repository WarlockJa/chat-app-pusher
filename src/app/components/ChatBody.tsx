import { useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";

export default function ChatBody() {
  const { activeRoom } = useChatRoomsContext();
  const { chatData } = useChatDataContext();
  const activeChatData = chatData?.find((item) => item.roomId === activeRoom);

  // console.log("ChatBody rerender");

  let chatContent;
  if (activeChatData?.state === "loading") chatContent = "Loading..."; // TODO replace with spinner

  if (activeChatData?.state === "error") chatContent = activeChatData.error;

  chatContent = activeChatData
    ? activeChatData.messages.map((msg, index) => (
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
