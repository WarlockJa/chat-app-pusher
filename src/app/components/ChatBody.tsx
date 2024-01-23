import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { format } from "date-fns";
import { Fragment, useLayoutEffect, useRef } from "react";

export default function ChatBody({ userId }: { userId: IUserId }) {
  const { activeRoom } = useChatRoomsContext();
  const { chatData } = useChatDataContext();
  // const activeRoomChatData = chatData?.find(
  //   (item) => item.room_id === activeRoom
  // );
  const chatData_ActiveRoom = chatData?.find(
    (room) => room.room_id === activeRoom
  );
  // console.log(chatData_ActiveRoom);
  const data: IChatData = chatData_ActiveRoom
    ? chatData_ActiveRoom
    : { room_id: activeRoom, messages: [], state: "loading" };

  // const { data, isLoading, error } = useSWRImmutable<IChatData>(
  //   `/api/v1/db?roomId=${activeRoom}`
  // );

  // scrolling to the last message
  const messageToScrollIntoViewRef = useRef<HTMLLIElement>(null);
  const paginationMarker = useRef(null);
  useLayoutEffect(() => {
    messageToScrollIntoViewRef.current
      ? messageToScrollIntoViewRef.current.scrollIntoView()
      : null;
  }, [messageToScrollIntoViewRef.current, activeRoom, data.messages.length]);

  let chatContent;
  let lastMessage = "";
  if (data.state === "loading") {
    chatContent = (
      <div className="chat__body--spinnerWrapper">
        <Spinner />
      </div>
    );
  } else if (data.state === "error") {
    chatContent = "Error while loading messages from the database";
  } else
    chatContent = data ? (
      <ul className="chat-display">
        <div ref={paginationMarker}></div>
        {data.messages.map((msg, index) => {
          const userIsMsgAuthor = msg.author === userId.user_id;
          const currentMsgDay = format(msg.timestamp, "y,M,d");
          const postDate = lastMessage !== currentMsgDay;
          lastMessage = currentMsgDay;

          return (
            <Fragment key={msg.author.concat(msg.timestamp.toString())}>
              {postDate ? (
                <div className="post post--center">
                  {format(msg.timestamp, "MMMM d")}
                </div>
              ) : null}
              <li
                key={index}
                className={`post ${
                  userIsMsgAuthor ? "post--left" : "post--right"
                }`}
                ref={
                  // finding first unread message or last message to scroll to
                  msg.unread && !messageToScrollIntoViewRef.current
                    ? messageToScrollIntoViewRef
                    : index === data.messages.length - 1
                    ? messageToScrollIntoViewRef
                    : null
                }
              >
                <div
                  className={`post__header ${
                    userIsMsgAuthor
                      ? "post__header--user"
                      : "post__header--reply"
                  }`}
                >
                  <span className="post__header--name">{msg.author}</span>
                  <span className="post__header--time">
                    {format(msg.timestamp, "k:mm")}
                  </span>
                </div>
                <div className="post__text">{msg.text}</div>
              </li>
            </Fragment>
          );
        })}
      </ul>
    ) : null;
  return <div className="chat__body">{chatContent}</div>;
}
