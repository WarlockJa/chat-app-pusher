import { IChatData_MessageExtended } from "@/context/ChatDataProvider";
import ChatBodyLIElement from "./ChatBodyLIElement";
import { format } from "date-fns";

export default function ChatBodyReadMessages({
  readMessages,
  user_id,
}: {
  readMessages: IChatData_MessageExtended[];
  user_id: string;
}) {
  let previousMessageDate = "";
  return readMessages.map((msg) => {
    const userIsMsgAuthor = msg.author === user_id;
    const currentMsgDate = format(msg.timestamp, "y,M,d");
    const postDate = previousMessageDate !== currentMsgDate;
    previousMessageDate = currentMsgDate;
    const msgID = msg.author.concat(msg.timestamp.toString());

    return (
      <div key={msgID} className="postWrapper">
        {postDate ? (
          <div className="post post--center">
            {format(msg.timestamp, "MMMM d")}
          </div>
        ) : null}
        <ChatBodyLIElement
          key={msg.author.concat(msg.timestamp.toString())}
          msg={msg}
          userIsMsgAuthor={userIsMsgAuthor}
        />
      </div>
    );
  });
}
