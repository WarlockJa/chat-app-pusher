import { useEffect, useRef, useState } from "react";
import { PresenceChannel } from "pusher-js";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useScrollPositionDataContext } from "@/context/innerContexts/ScrollPositionProvider";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import bindMessage from "./channelBinds/bindMessage";
import bindTyping from "./channelBinds/bindTyping";
import bindPusherMemberAdded from "./channelBinds/bindPusherMemberAdded";
import bindPusherMemberRemoved from "./channelBinds/bindPusherMemberRemoved";
import bindPusherSubscriptionSucceeded from "./channelBinds/bindPusherSubscriptionSucceeded";

// this hook tracks changes in roomsList and adjusts pusher subscriptions
// according to access role of the user
export default function useSubscriptions({
  userId,
  pusher,
}: {
  userId: TPrisma_User;
  pusher: PusherPresence;
}) {
  const [subscriptions, setSubscriptions] = useState<PresenceChannel[]>([]);
  // roomsList context and useReducer dispatch methods
  const { roomsList, dispatchChatRooms } = useChatRoomsContext();
  // local chat data
  const { dispatchChatData } = useChatDataContext();
  // users typing data
  const { dispatchUsersTyping } = useUsersTypingContext();
  // pagination data
  const { dispatchPagination } = usePaginationContext();
  // scroll position data
  const { dispatchScrollPosition } = useScrollPositionDataContext();
  // known users context
  const { knownUsers_addNewUser } = useKnownUsersContext();
  // timeouts array for typing users. Using ref because bind makes a snapshot of useState and can't access new data
  const typingUsers = useRef<ITypingUserTimeout[]>([]);

  useEffect(() => {
    const { user_admin } = userId;

    // subscribing to channels added to roomsList
    roomsList.forEach((room) => {
      // found subscription channel present in roomsList but not in subscriptions
      if (
        subscriptions.findIndex((channel) => channel.name === room.name) === -1
      ) {
        // subscribing to channel with room name, modifying subscriptions state
        const newChannel = pusher.subscribe(room.name);
        setSubscriptions((prev) => [...prev, newChannel]);

        // if user is not an administrator no further interactions with presence-system required
        if (room.name === "presence-system" && !user_admin) return;

        // binding to the Pusher "message" event
        bindMessage({ newChannel, dispatchChatData, knownUsers_addNewUser });

        // binding to the Pusher "typing" event
        bindTyping({
          newChannel,
          dispatchUsersTyping,
          typingUsers: typingUsers.current,
        });

        // member_added and member_removed binds used to update number of users on the channel
        // i.e. allows to monitor if admin/user is present
        // binding to the Pusher "pusher:member_added" event
        bindPusherMemberAdded({ newChannel, dispatchChatRooms });

        // binding to the Pusher "pusher:member_removed" event
        bindPusherMemberRemoved({ newChannel, dispatchChatRooms });

        // fetching list of currently active user rooms upon initial load
        // binding to the Pusher "pusher:subscription_succeeded" event
        bindPusherSubscriptionSucceeded({
          newChannel,
          dispatchChatData,
          dispatchChatRooms,
          dispatchPagination,
          dispatchScrollPosition,
          dispatchUsersTyping,
          knownUsers_addNewUser,
          pusher,
          userId,
        });
      }
    });

    // unsubscribing from channels removed from roomsList
    subscriptions.forEach((channel) => {
      // found channel that exists in subscriptions but not in roomsList
      if (roomsList.findIndex((room) => room.name === channel.name) === -1) {
        // unsubscribing from channel modifying subscriptions state
        channel.unsubscribe();
        setSubscriptions((prev) =>
          prev.filter((removeChannel) => channel !== removeChannel)
        );
      }
    });

    // cleanup
    return () => {
      // clearing users typing timouts
      typingUsers.current.forEach((user) => clearTimeout(user.timeout));
    };
    // cleanup function for subscriptions is not required
    // existing subscriptions terminated on pusherClient disconnect
  }, [roomsList.length]);
}
