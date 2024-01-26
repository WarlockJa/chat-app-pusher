import {
  IChatData_MessageExtended,
  useChatDataContext,
} from "@/context/ChatDataProvider";
import { format } from "date-fns";
import { Fragment, useEffect, useRef } from "react";
import ChatBodyLIElement from "./ChatBodyLIElement";

export default function ChatBodyUnreadMessages({
  unreadMessages,
  user_id,
  activeRoom,
  unreadMessagesRefsArray,
}: {
  unreadMessages: IChatData_MessageExtended[];
  user_id: string;
  activeRoom: string;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLLIElement[]>;
}) {
  const { dispatch } = useChatDataContext();

  // observer.
  const observerRef = useRef<IntersectionObserver | null>(null);

  // applying IntersectionObserver to unread <li> refs
  useEffect(() => {
    // checking that unreadMessagesRefsArray is initialized
    if (unreadMessagesRefsArray.current.length === 0) return;
    // checking that unreadMessagesRefsArray has <li> data
    if (unreadMessagesRefsArray.current.find((item) => item === null)) return;

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
          dispatch({
            type: "setMessageAsRead",
            room_id: activeRoom,
            msgID: entry.target.id,
          });
        } else {
          // Element is out of the viewport
          // console.log("Element is out of the viewport:", entry.target);
        }
      });
    };

    // reinitializing observer instance when unreadMessages changes
    if (observerRef.current) observerRef.current.disconnect();
    // Create an intersection observer with the specified callback and options
    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // Start observing the target elements
    unreadMessagesRefsArray.current.forEach((element) => {
      if (!element || !observerRef.current) return;

      observerRef.current.observe(element);
    });

    // Cleanup the observer when the component is unmounted
    return () => {
      if (!observerRef.current) return;
      observerRef.current.disconnect();
    };
  }, [JSON.stringify(unreadMessages)]);

  let lastMessage = "";
  return unreadMessages.map((msg, index) => {
    const userIsMsgAuthor = msg.author === user_id;
    const currentMsgDay = format(msg.timestamp, "y,M,d");
    const postDate = lastMessage !== currentMsgDay;
    lastMessage = currentMsgDay;

    const msgID = msg.author.concat(msg.timestamp.toString());

    return (
      <Fragment key={msgID}>
        <div
          className="unreadPostWrapper"
          id={msgID}
          ref={(el: HTMLDivElement) =>
            (unreadMessagesRefsArray.current[index] =
              el as unknown as HTMLLIElement)
          }
        >
          {postDate ? (
            <div className="post post--center">
              <span className="post--new">New!</span>{" "}
              {format(msg.timestamp, "MMMM d")}
            </div>
          ) : null}
          <ChatBodyLIElement
            key={msg.author.concat(msg.timestamp.toString())}
            msg={msg}
            // refUnread={{ ref: unreadMessagesRefsArray, index }}
            userIsMsgAuthor={userIsMsgAuthor}
          />
        </div>
      </Fragment>
    );
  });
}
