import {
  PusherPresence,
  usePusherContext,
} from "@/context/outerContexts/PusherProvider";
import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";
import { pusherClient } from "@/lib/pusher/pusher";
import { useEffect } from "react";

// establishing pusher connection
// if no user data present pusher connection is not initiated and
// anonymous user data awaited to be filled in NoUserPlug
export default function usePusherConnection() {
  const { userId } = useUserIdContext();
  const { pusher, setPusher } = usePusherContext();

  useEffect(() => {
    // processing change of authenticated user data from the parent
    if (pusher) {
      pusher.disconnect();
      setPusher(null);
    }

    if (!userId?.user_id) return;

    try {
      const pusherInstance = pusherClient({
        user_id: userId.user_id,
        user_admin: userId.user_admin,
        user_name: userId.user_name,
      }) as PusherPresence;
      setPusher(pusherInstance);
    } catch (error) {
      // TODO check for zod of pusher error
      console.log(error);
      throw new Error(JSON.stringify(error));
    }

    return () => {
      // cleanup
      if (!pusher) return;
      console.log("Exit chat Cleanup");
      pusher.disconnect();
    };
  }, [userId?.user_id]);
}
