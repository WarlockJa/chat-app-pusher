import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import { IMessage } from "@/lib/prisma/prisma";
import { format } from "date-fns";

interface IChatBodyLIElementProps {
  user_id: string;
  msg: IMessage;
}

export default function ChatBodyLIElement({
  user_id,
  msg,
}: IChatBodyLIElementProps) {
  // finding if current user is the message author
  const userIsMsgAuthor = msg.author === user_id;
  // KnownUsers method to find user data by user_id
  const { knownUsers_findKnownUser } = useKnownUsersContext();
  // finding message author's data from KnownUsers context
  const msgAuthor = knownUsers_findKnownUser(msg.author);

  return (
    <li className={`post ${userIsMsgAuthor ? "post--left" : "post--right"}`}>
      <div
        className={`post__header ${
          userIsMsgAuthor ? "post__header--user" : "post__header--reply"
        }`}
      >
        <span className="post__header--name">
          {msgAuthor ? msgAuthor.user_name : msg.author}
        </span>
      </div>
      <div className="post__text">{msg.text}</div>
      <div className="post__footer">
        <span className="post__footer--time">
          {format(msg.timestamp, "k:mm")}
        </span>
      </div>
    </li>
  );
}
