import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";

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
      // TODO replace TEST
      // establishing pusher connection
      // setPusher(pusherClient(userId.user_id));
      // TEST
      if (userId.user_name === "WJ" || userId.user_name === "Mike") {
        const pusherInstance = pusherClient(userId.user_name);
        setPusher(pusherInstance);
      } else {
        const pusherInstance = pusherClient(userId.user_id);
        console.log(pusherInstance);
        setPusher(pusherInstance);
      }
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
