import { PusherPresence } from "@/context/outerContexts/PusherProvider";
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
