import { useChatDataContext } from "@/context/ChatDataProvider";
import { getChannelHistoryMessages } from "@/lib/apiDBMethods";
import { useEffect, useRef } from "react";

export default function PaginationMarker({
  paginationMarker,
  user_id,
  channel_name,
}: {
  paginationMarker: React.RefObject<HTMLDivElement>;
  user_id: string;
  channel_name: string;
}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { dispatch: dispatchChatData } = useChatDataContext();

  useEffect(() => {
    // removing observer if pagination marker undefined
    if (!paginationMarker.current) {
      observerRef.current?.disconnect();
      return;
    }

    // InterectionOberver options
    const options = {
      // root: null, // use the viewport as the root
      // rootMargin: '0px', // no margin
      threshold: 1, // 0 means fully out of the viewport, 1 means fully in the viewport
    };

    const handleIntersection: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        // Element is in the viewport
        // console.log("Element is in the viewport:", entry.target);

        // chat history loaded flag
        dispatchChatData({
          type: "setPaginationState",
          room_id: channel_name,
          newState: "loading",
        });

        getChannelHistoryMessages({
          dispatchChatData,
          params: {
            user_id,
            channel_name,
          },
        });
      } else {
        // Element is out of the viewport
        // console.log("Element is out of the viewport:", entry.target);
      }
    };

    // reinitializing observer instance when unreadMessages changes
    // if (observerRef.current) observerRef.current.disconnect();
    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Start observing the target elements
    // unreadMessagesRefsArray.current.forEach((element) => {
    // if (!observerRef.current) return;

    observerRef.current.observe(paginationMarker.current);
    // });

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, [paginationMarker.current]);

  return <div ref={paginationMarker}></div>;
}
