import { userIdAtom } from "@/lib/localState";
import { pusherClient } from "@/lib/pusher";
import { useAtom } from "jotai";
import Pusher from "pusher-js/types/src/core/pusher";
import { useEffect, useState } from "react";

// establishing pusher connection
// if no user data present pusher connection is not initiated and
// anonymous user data awaited to be filled in NoUserPlug
export default function usePusherConnection() {
  const [pusher, setPusher] = useState<Pusher | null>(null);
  const [userId] = useAtom(userIdAtom);

  useEffect(() => {
    // processing change of authenticated user data from the parent
    if (pusher) pusher.disconnect();

    if (!userId.user_id) return;

    // TODO replace TEST
    // establishing pusher connection
    // setPusher(pusherClient(userId.user_id));
    // TEST
    userId.user_name === "WJ" || userId.user_name === "Mike"
      ? setPusher(pusherClient(userId.user_name))
      : setPusher(pusherClient(userId.user_id));

    return () => {
      // cleanup
      if (!pusher) return;
      console.log("Exit chat Cleanup");
      pusher.disconnect();
    };
  }, [userId.user_id]);

  return { pusher };
}
