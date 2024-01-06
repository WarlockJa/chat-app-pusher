import useChatData from "@/hooks/useChatData";
import useSubscriptions from "@/hooks/useSubscriptions";
import Pusher from "pusher-js/types/src/core/pusher";

export default function HooksElement({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: Pusher;
}) {
  useChatData({ userId });
  useSubscriptions({ pusher, userId });

  return null;
}
