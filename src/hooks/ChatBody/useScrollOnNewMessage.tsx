import { useLayoutEffect } from "react";

export default function useScrollOnNewMessage({
  unreadMessagesRefsArray,
  currentRoomScrollData,
  setCurrentRoomScrollData,
  unreadMessagesCount,
}: {
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  currentRoomScrollData: ICurrentRoomScrollData;
  setCurrentRoomScrollData: (data: ICurrentRoomScrollData) => void;
  unreadMessagesCount: number;
}) {
  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
    // new message in the same room. Scenarios 3-4
    // checking that added message is a new one
    if (
      currentRoomScrollData.scrollPosition.previousUnreadMsgCount !==
      unreadMessagesCount
    ) {
      // unread messages at first do not count towards unreadMessagesCount because they don't have ref yet
      if (
        unreadMessagesRefsArray.current.filter((item) => item).length !==
        unreadMessagesCount
      ) {
        // console.log("unread messages without refs cutoff");
        return;
      }

      // console.log("New unread messages. Scenarios 3-4");
      if (currentRoomScrollData.scrollPosition.isPreviousBottom) {
        // Scenario 3: (SAME ROOM + NEW MESSAGE + SCROLLED TO BOTTOM)
        // scrolling first unread message into view, in case it is larger than viewport
        if (unreadMessagesRefsArray.current[0])
          unreadMessagesRefsArray.current[0].scrollIntoView();
      }

      // Scenario 4: (SAME ROOM + NEW MESSAGE + NOT SCROLLED TO BOTTOM)
      // doing nothing. Story: user is reading previous messages and scrolling would interfere with that.

      // saving new previousUnreadMsgCount
      setCurrentRoomScrollData({
        ...currentRoomScrollData,
        scrollPosition: {
          ...currentRoomScrollData.scrollPosition,
          previousUnreadMsgCount: unreadMessagesCount,
        },
      });
    }
  }, [unreadMessagesCount]);
}
