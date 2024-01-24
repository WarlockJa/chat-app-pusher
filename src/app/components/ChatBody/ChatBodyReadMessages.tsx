import { IChatData_MessageExtended } from "@/context/ChatDataProvider";
import ChatBodyLIElement from "./ChatBodyLIElement";
import { format } from "date-fns";
import { Fragment } from "react";

export default function ChatBodyReadMessages({
  readMessages,
  user_id,
  messageToScrollIntoViewRef,
}: {
  readMessages: IChatData_MessageExtended[];
  user_id: string;
  messageToScrollIntoViewRef: React.RefObject<HTMLLIElement>;
}) {
  let lastMessage = "";
  return readMessages.map((msg, index) => {
    const userIsMsgAuthor = msg.author === user_id;
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
        <ChatBodyLIElement
          key={msg.author.concat(msg.timestamp.toString())}
          msg={msg}
          refLastRead={
            index === readMessages.length - 1
              ? messageToScrollIntoViewRef
              : undefined
          }
          userIsMsgAuthor={userIsMsgAuthor}
        />
      </Fragment>
    );
  });
}
