import { PusherPresence } from "@/context/PusherProvider";
import useSubscriptions from "@/hooks/useSubscriptions";

export default function SubscriptionsHookWrapper({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  // console.log("--------------Hooks rerender");
  useSubscriptions({ pusher, userId });

  return null;
}
