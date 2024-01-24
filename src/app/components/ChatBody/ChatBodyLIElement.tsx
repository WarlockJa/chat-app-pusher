import { IChatData_MessageExtended } from "@/context/ChatDataProvider";
import { format } from "date-fns";

// TODO try making mutually exclusive refLastRead and refUnread
interface IChatBodyLIElementProps {
  userIsMsgAuthor: boolean;
  refLastRead?: { current: HTMLLIElement | null };
  refUnread?: {
    ref: React.RefObject<HTMLLIElement[]>;
    index: number;
    id: string;
  };
  msg: IChatData_MessageExtended;
}

export default function ChatBodyLIElement(props: IChatBodyLIElementProps) {
  const { userIsMsgAuthor, refLastRead, refUnread, msg } = props;

  return (
    <li
      className={`post ${userIsMsgAuthor ? "post--left" : "post--right"}`}
      id={refUnread ? refUnread.id : undefined}
      ref={(el: HTMLLIElement) =>
        refLastRead !== undefined
          ? (refLastRead.current = el)
          : refUnread
          ? refUnread.ref.current
            ? (refUnread.ref.current[refUnread.index] = el)
            : null
          : null
      }
    >
      <div
        className={`post__header ${
          userIsMsgAuthor ? "post__header--user" : "post__header--reply"
        }`}
      >
        <span className="post__header--name">{msg.author}</span>
        <span className="post__header--time">
          {format(msg.timestamp, "k:mm")}
        </span>
      </div>
      <div className="post__text">{msg.text}</div>
    </li>
  );
}
