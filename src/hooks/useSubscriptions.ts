import { useEffect, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";

export default function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // pusher connection instance
  const { pusher } = usePusherContext();
  // state data
  const { userId } = useUserIdContext();
  const { roomsList } = useChatRoomsContext();

  // cleanup subscriptions function
  const handleUnsubscribeAllChannels = () => {
    subscriptions.forEach((channel) => channel.unsubscribe());
    setSubscriptions([]);
  };

  useEffect(() => {
    // processing user logout
    if (!userId?.user_id) {
      handleUnsubscribeAllChannels();
    }

    // failsafe check for pusher instance
    // if no pusher instance exists when user_id present
    // meaning there is an issue with Pusher service
    // TODO consider showing error message
    if (!pusher) return;

    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found room present in roomsList but not in subscriptions
      if (subscriptions.findIndex((channel) => channel.name === room) === -1) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room) as PresenceChannel;
        setSubscriptions((prev) => [...prev, newChannel]);
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (roomsList.findIndex((room) => room === channel.name) === -1) {
        // unsubscribing from channel modifying subscriptions state
        channel.unsubscribe();
        setSubscriptions((prev) =>
          prev.filter((removeChannel) => channel !== removeChannel)
        );
      }
    });

    return () => handleUnsubscribeAllChannels();
  }, [roomsList.length, userId?.user_id]);

  return { subscriptions };
}
