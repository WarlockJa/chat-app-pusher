import { IChatData_MessageExtended } from "@/context/ChatDataProvider";
import { format } from "date-fns";
import ChatBodyLIElement from "./ChatBodyLIElement";
import getMsgKey from "@/util/getMsgKey";
import ChatBodyMessageHeader from "./ChatBodyMessageHeader";
import useIOUnreadMsgsArray from "@/hooks/ChatBody/useIOUnreadMsgsArray";

export default function ChatBodyUnreadMessages({
  unreadMessages,
  user_id,
  activeRoom,
  unreadMessagesRefsArray,
  showFirstDate,
}: {
  unreadMessages: IChatData_MessageExtended[];
  user_id: string;
  activeRoom: string;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  showFirstDate: Date | undefined;
}) {
  // attaching IntersectionObserver to post elements via unreadMessagesRefsArray
  useIOUnreadMsgsArray({ activeRoom, unreadMessagesRefsArray });

  // generating unread messages elements
  let previousMessageDate = "";
  return unreadMessages.map((msg, index) => {
    const userIsMsgAuthor = msg.author === user_id;
    const currentMsgDate = format(msg.timestamp, "y,M,d");

    // creating "unique" message key
    const msgID = getMsgKey(msg);

    // displaying post header if date changes from previous post
    let postDate = null;
    if (
      index === 0 &&
      showFirstDate &&
      format(showFirstDate, "y,M,d") !== currentMsgDate
    ) {
      // first unread element, comparing dates to the last read message data, if exists
      postDate = <ChatBodyMessageHeader timestamp={msg.timestamp} newPost />;
    } else if (
      index > 0 &&
      format(previousMessageDate, "y,M,d") !== currentMsgDate
    ) {
      // elements past first compared to their previous element
      postDate = <ChatBodyMessageHeader timestamp={msg.timestamp} newPost />;
    }

    // saving current message date for comparison with the next message
    previousMessageDate = currentMsgDate;

    return (
      <div
        className="postWrapper"
        id={msgID}
        key={msgID}
        ref={(el: HTMLDivElement) =>
          (unreadMessagesRefsArray.current[index] = el)
        }
      >
        {postDate}
        <ChatBodyLIElement msg={msg} userIsMsgAuthor={userIsMsgAuthor} />
      </div>
    );
  });
}
