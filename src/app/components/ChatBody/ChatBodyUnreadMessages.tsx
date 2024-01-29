import {
  IChatData_MessageExtended,
  useChatDataContext,
} from "@/context/ChatDataProvider";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import ChatBodyLIElement from "./ChatBodyLIElement";

export default function ChatBodyUnreadMessages({
  unreadMessages,
  user_id,
  activeRoom,
  unreadMessagesRefsArray,
  showFirstDate,
  setUnreadMessagesCount,
}: {
  unreadMessages: IChatData_MessageExtended[];
  user_id: string;
  activeRoom: string;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLLIElement[]>;
  showFirstDate: Date | undefined;
  setUnreadMessagesCount: (newUnreadMessagesCount: number) => void;
}) {
  const { dispatch } = useChatDataContext();

  // observer.
  const observerRef = useRef<IntersectionObserver | null>(null);

  // initializing observer
  useEffect(() => {
    // console.log("Observer init");

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

          // removing reference from unreadMessagesRefsArray
          // TEST
          // const test = unreadMessagesRefsArray.current.find(
          //   (item) => item === entry.target
          // );
          // console.log(test?.id);

          unreadMessagesRefsArray.current =
            unreadMessagesRefsArray.current.filter(
              (ref) => ref !== entry.target
            );

          // console.log("between: ", unreadMessagesRefsArray.current.length);

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

    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, []);

  // applying IntersectionObserver observe to unread <li> refs
  useEffect(() => {
    // checking that unreadMessagesRefsArray is initialized
    if (unreadMessagesRefsArray.current.length === 0) return;
    // checking that unreadMessagesRefsArray has <li> data
    // if (unreadMessagesRefsArray.current.find((item) => item === null)) return;

    // Start observing the target elements
    // console.log("before unread: ", unreadMessages.length);
    // console.log("before: ", unreadMessagesRefsArray.current);
    unreadMessagesRefsArray.current.forEach((element) => {
      // console.log(element);
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
    // console.log("after: ", unreadMessagesRefsArray.current);
  }, [JSON.stringify(unreadMessages)]);

  let lastMessage = "";
  return unreadMessages.map((msg, index) => {
    const userIsMsgAuthor = msg.author === user_id;
    const currentMsgDay = format(msg.timestamp, "y,M,d");

    const msgID = msg.author.concat(msg.timestamp.toString());

    const postDate = showFirstDate ? (
      format(showFirstDate, "y,M,d") !== currentMsgDay ? (
        <div className="post post--center">
          <span className="post--new">New!</span>{" "}
          {format(msg.timestamp, "MMMM d")}
        </div>
      ) : null
    ) : null;

    // saving current message date for comparison with the next message
    lastMessage = currentMsgDay;

    // if (msg.text === "L'Ombre") console.log(postDate);

    return (
      <div
        className="unreadPostWrapper"
        id={msgID}
        key={msgID}
        ref={
          (el: HTMLDivElement) =>
            (unreadMessagesRefsArray.current[index] =
              el as unknown as HTMLLIElement) // TODO fix TS
        }
      >
        {postDate}
        <ChatBodyLIElement
          key={msg.author.concat(msg.timestamp.toString())}
          msg={msg}
          userIsMsgAuthor={userIsMsgAuthor}
        />
      </div>
    );
  });
}
