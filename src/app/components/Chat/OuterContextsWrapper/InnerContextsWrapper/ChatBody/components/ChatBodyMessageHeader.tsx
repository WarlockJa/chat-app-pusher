import { format } from "date-fns";

interface IChatBodyMessageHeaderProps {
  timestamp: string;
  newPost?: boolean;
}

export default function ChatBodyMessageHeader({
  timestamp,
  newPost,
}: IChatBodyMessageHeaderProps) {
  return (
    <div className="post post--center">
      {newPost ? <span className="post--new">New!</span> : null}{" "}
      {format(timestamp, "MMMM d")}
    </div>
  );
}
