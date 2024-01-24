import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useLayoutEffect, useRef } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";

export default function ChatBody({ userId }: { userId: IUserId }) {
  const { activeRoom } = useChatRoomsContext();
  const { chatData } = useChatDataContext();

  // getting active room chat data
  const chatData_ActiveRoom = chatData?.find(
    (room) => room.room_id === activeRoom
  );

  const data: IChatData = chatData_ActiveRoom
    ? chatData_ActiveRoom
    : { room_id: activeRoom, messages: [], state: "loading" };

  // TODO pagination
  const paginationMarker = useRef(null);
  // scrolling to the last read message
  const messageToScrollIntoViewRef = useRef<HTMLLIElement>(null);
  useLayoutEffect(() => {
    messageToScrollIntoViewRef.current
      ? messageToScrollIntoViewRef.current.scrollIntoView()
      : null;
  }, [activeRoom]);

  let chatContent;

  if (data.state === "loading") {
    chatContent = (
      <div className="chat__body--spinnerWrapper">
        <Spinner />
      </div>
    );
  } else if (data.state === "error") {
    chatContent = "Error while loading messages from the database";
  } else {
    // read/unread messages to be displayed
    const readMessages = data.messages.filter((message) => !message.unread);
    const unreadMessages = data.messages.filter((message) => message.unread);

    chatContent = data ? (
      <ul className="chat-display">
        <div ref={paginationMarker}></div>
        <ChatBodyReadMessages
          readMessages={readMessages}
          user_id={userId.user_id}
          messageToScrollIntoViewRef={messageToScrollIntoViewRef}
        />
        <ChatBodyUnreadMessages
          unreadMessages={unreadMessages}
          user_id={userId.user_id}
          activeRoom={activeRoom}
        />
      </ul>
    ) : null;
  }
  return <div className="chat__body">{chatContent}</div>;
}
