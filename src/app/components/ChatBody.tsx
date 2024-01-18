import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/lib/Spinner";
import { format } from "date-fns";
import { Fragment, useLayoutEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";

export default function ChatBody({ userId }: { userId: IUserId }) {
  const { activeRoom } = useChatRoomsContext();
  // const { chatData } = useChatDataContext();
  // const activeRoomChatData = chatData?.find(
  //   (item) => item.roomId === activeRoom
  // );

  const { data, isLoading, error } = useSWRImmutable<IChatData>(
    `/api/v1/db?roomId=${activeRoom}`
  );

  // scrolling to the last message
  const lastMessageRef = useRef<HTMLLIElement>(null);
  useLayoutEffect(() => {
    lastMessageRef.current ? lastMessageRef.current.scrollIntoView() : null;
  }, [lastMessageRef.current]);

  let chatContent;
  let lastDateDay = "";
  if (isLoading) {
    chatContent = (
      <div className="chat__body--spinnerWrapper">
        <Spinner />
      </div>
    );
  } else if (error) {
    chatContent = error;
  } else
    chatContent = data ? (
      <ul className="chat-display">
        {data.messages.map((msg, index) => {
          const userIsMsgAuthor = msg.author === userId.user_id;
          return (
            <Fragment key={msg.author.concat(msg.timestamp.toString())}>
              {lastDateDay !== format(msg.timestamp, "y,M,d") ? (
                <div className="post post--center">
                  {format(msg.timestamp, "MMMM d")}
                </div>
              ) : null}
              <li
                key={index}
                className={`post ${
                  userIsMsgAuthor ? "post--left" : "post--right"
                }`}
                ref={index === data.messages.length - 1 ? lastMessageRef : null}
              >
                <div
                  className={`post__header ${
                    userIsMsgAuthor
                      ? "post__header--user"
                      : "post__header--reply"
                  }`}
                >
                  <span className="post__header--name">{msg.author}</span>
                  {/* TODO get time format correct */}
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
