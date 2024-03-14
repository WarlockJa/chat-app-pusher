import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import useSubscriptions from "@/hooks/useSubscriptions";
import { TPrisma_User } from "@/lib/prisma/prisma";

export default function SubscriptionsHookWrapper({
  userId,
  pusher,
}: {
  userId: TPrisma_User;
  pusher: PusherPresence;
}) {
  // console.log("--------------Hooks rerender");
  useSubscriptions({ pusher, userId });

  return null;
}
