import { PusherPresence } from "@/context/PusherProvider";
import useSubscriptions from "@/hooks/useSubscriptions";

export default function HooksElement({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  // console.log("--------------Hooks rerender");
  // useChatData({ userId });
  useSubscriptions({ pusher, userId });

  return null;
}
