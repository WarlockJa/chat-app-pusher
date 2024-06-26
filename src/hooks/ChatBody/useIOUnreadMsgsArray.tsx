import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { apiDB_updateLastaccessTimestamp } from "@/lib/apiDBMethods/apiDB_updateLastAccessTimestamp";
import { TPrisma_ChatData } from "@/lib/prisma/prisma";
import { useEffect, useRef } from "react";
import getOlderMessage from "./utils/getOlderMessage";

interface IUseIntersectionObserverArrayProps {
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  activeRoom: string;
  user_id: string;
  user_admin: boolean;
  activeRoom_chatData: TPrisma_ChatData;
}

export default function useIOUnreadMsgsArray({
  unreadMessagesRefsArray,
  activeRoom,
  user_id,
  user_admin,
  activeRoom_chatData,
}: IUseIntersectionObserverArrayProps) {
  // observer.
  const observerRef = useRef<IntersectionObserver | null>(null);
  // handleIntersection dependencies
  const { dispatchChatData } = useChatDataContext();

  // initializing observer
  useEffect(() => {
    // InterectionOberver options
    const options = {
      // root: null, // use the viewport as the root
      // rootMargin: '0px', // no margin
      threshold: 0.8, // 0 means fully out of the viewport, 1 means fully in the viewport
    };

    const handleIntersection: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      // preparing an object to store data about latest message observed for debounced DB update lastaccess query
      let debouncedLastAccessUpdate: IIODebouncedEntry | undefined;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is in the viewport
          // console.log("Element is in the viewport:", entry.target);

          // removing observer from the <li> element
          observerRef.current?.unobserve(entry.target);

          // updating status for the message as being read
          dispatchChatData({
            type: "setMessageAsRead",
            roomName: activeRoom,
            message_id: entry.target.id,
          });

          // initiating debouncedLastAccessUpdate with first entry data
          if (!debouncedLastAccessUpdate) {
            debouncedLastAccessUpdate = {
              message_id: entry.target.id,
              entryTimestamp: entry.time,
            };
          } else {
            // comparing messages' timestamps in chatData corresponding to the message_id found in
            // debouncedLastAccessUpdate and current entry.target
            const olderMessageData = getOlderMessage({
              activeRoom_chatData,
              first: debouncedLastAccessUpdate,
              second: {
                message_id: entry.target.id,
                entryTimestamp: entry.time,
              },
            });
            // saving data for the message with the older timestamp to be used in DB lastaccess update
            if (olderMessageData) debouncedLastAccessUpdate = olderMessageData;
          }
        }
        // else {
        //   // Element is out of the viewport
        //   console.log("Element is out of the viewport:", entry.target);
        // }
      });
      // updating lastaccess array in DB for the user with debounced last read message timestamp
      if (debouncedLastAccessUpdate) {
        // during optimistic new message update this call may be unnecessary
        // but it covers scenario when new message is not immediately read by the author
        apiDB_updateLastaccessTimestamp({
          body: {
            channel_name: activeRoom,
            user_id,
            message_id: debouncedLastAccessUpdate.message_id,
          },
          accessToken: {
            user_id,
            user_admin,
          },
        });
      }
    };

    // console.log("Observer init");
    if (observerRef.current) observerRef.current.disconnect();
    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, [activeRoom]);

  // workloop for the first unread message
  useEffect(() => {
    // checking that unreadMessagesRefsArray is initialized
    if (unreadMessagesRefsArray.current[0] === null) return;

    // Start observing the target elements
    unreadMessagesRefsArray.current.forEach((element) => {
      if (!element || !observerRef.current) return;
      // checking if element is already being observed
      if (
        !observerRef.current
          .takeRecords()
          .some((entry) => entry.target === element)
      ) {
        observerRef.current.observe(element);
      }
    });
  }, [unreadMessagesRefsArray.current[0]]);
}
