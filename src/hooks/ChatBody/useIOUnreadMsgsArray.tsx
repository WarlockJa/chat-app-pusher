import { useChatDataContext } from "@/context/ChatDataProvider";
import { useEffect, useRef } from "react";

interface IUseIntersectionObserverArrayProps {
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  activeRoom: string;
}

export default function useIOUnreadMsgsArray({
  unreadMessagesRefsArray,
  activeRoom,
}: IUseIntersectionObserverArrayProps) {
  // observer.
  const observerRef = useRef<IntersectionObserver | null>(null);
  // handleIntersection dependencies
  const { dispatch } = useChatDataContext();

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
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Element is in the viewport
          // console.log("Element is in the viewport:", entry.target);

          // removing observer from the <li> element
          observerRef.current?.unobserve(entry.target);

          // updating status for the message as being read
          dispatch({
            type: "setMessageAsRead",
            room_id: activeRoom,
            msgID: entry.target.id,
          });

          // TODO add db call to update lastaccess. use entry.time to debounce DB requests
        }
        // else {
        //   // Element is out of the viewport
        //   console.log("Element is out of the viewport:", entry.target);
        // }
      });
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

  // workloop for message
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
