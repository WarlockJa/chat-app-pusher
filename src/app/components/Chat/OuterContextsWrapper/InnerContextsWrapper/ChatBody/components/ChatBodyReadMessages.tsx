import ChatBodyLIElement from "./ChatBodyLIElement";
import { format } from "date-fns";
import ChatBodyMessageHeader from "./ChatBodyMessageHeader";
import { IMessage } from "@/lib/prisma/prisma";

export default function ChatBodyReadMessages({
  readMessages,
  user_id,
  topReadMessageMarker,
}: {
  readMessages: IMessage[];
  user_id: string;
  topReadMessageMarker: React.RefObject<HTMLDivElement>;
}) {
  let previousMessageDate = "";
  return readMessages.map((msg, index) => {
    const userIsMsgAuthor = msg.author.user_id === user_id;
    const currentMsgDate = format(msg.timestamp, "y,M,d");
    const postDate = previousMessageDate !== currentMsgDate;
    previousMessageDate = currentMsgDate;

    return (
      <div
        key={msg.id}
        className="postWrapper"
        ref={index === 0 ? topReadMessageMarker : null}
      >
        {postDate ? <ChatBodyMessageHeader timestamp={msg.timestamp} /> : null}
        <ChatBodyLIElement msg={msg} userIsMsgAuthor={userIsMsgAuthor} />
      </div>
    );
  });
}
