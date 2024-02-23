import { IChatData_MessageExtended } from "@/context/innerContexts/ChatDataProvider";
import { format } from "date-fns";

interface IChatBodyLIElementProps {
  userIsMsgAuthor: boolean;
  msg: IChatData_MessageExtended;
}

export default function ChatBodyLIElement(props: IChatBodyLIElementProps) {
  const { userIsMsgAuthor, msg } = props;

  return (
    <li className={`post ${userIsMsgAuthor ? "post--left" : "post--right"}`}>
      <div
        className={`post__header ${
          userIsMsgAuthor ? "post__header--user" : "post__header--reply"
        }`}
      >
        <span className="post__header--name">{msg.author.user_name}</span>
        <span className="post__header--time">
          {format(msg.timestamp, "k:mm")}
        </span>
      </div>
      <div className="post__text">{msg.text}</div>
    </li>
  );
}
