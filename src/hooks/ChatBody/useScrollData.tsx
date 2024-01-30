/* 
This hook abstracts automatic scrolling inside ChatBody when either activeRoom or
the amount of messages to display changes
Possible scenarios include:
1 - Changing to the new active room that has new messages (ACTIVE ROOM + NEW MESSAGES):
  scrolling to the new message
2 - Changing to a new active room that has no new messages (ACTIVE ROOM + NO NEW MESSAGES):
  scrolling to the previous position saved for the room
3 - New message arrives when ChatBody is scrolled to the bottom (SAME ROOM + NEW MESSAGE + SCROLLED TO BOTTOM):
  scroll new message into the view
4 - New message arrives when ChatBody is not scrolled to the bottom (SAME ROOM + NEW MESSAGE + NOT SCROLLED TO BOTTOM):
  no scrolling required
5 - New history chat data page is loaded and added to the top (SAME ROOM + NEW HISTORY PAGE):
  preserve current viewport position
*/

import {
  IChatData,
  IChatDataSetScrollPosition,
} from "@/context/ChatDataProvider";
import { useEffect, useLayoutEffect } from "react";

export default function useScrollData({
  chatBodyRef,
  unreadMessagesRefsArray,
  currentRoomScrollData,
  setCurrentRoomScrollData,
  dispatch,
  activeRoom,
  readMessagesCount,
  unreadMessagesCount,
}: {
  chatBodyRef: React.RefObject<HTMLDivElement>;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLLIElement[]>;
  currentRoomScrollData: ICurrentRoomScrollData;
  setCurrentRoomScrollData: (data: ICurrentRoomScrollData) => void;
  dispatch: (action: IChatDataSetScrollPosition) => void;
  activeRoom: string;
  readMessagesCount: number;
  unreadMessagesCount: number;
  // data: IChatData;
}) {
  // const unreadMessagesCount = unreadMessagesRefsArray.current.filter(
  //   (item) => item
  // ).length;
  // const readMessageCount = data.messages.filter(
  //   (message) => !message.unread
  // ).length;

  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
    if (!chatBodyRef.current) return;
    console.log(
      "useLayoutEffect",
      currentRoomScrollData.scrollPosition.previousScrollHeight
    );

    // active room change. Scenarios 1-2
    if (activeRoom !== currentRoomScrollData.currentRoom) {
      console.log("ActiveRoom change. Scenarios 1-2");
      // Updating last scroll position for the active room that is about to change
      if (currentRoomScrollData.currentRoom !== "") {
        // saving scroll data to previous room if existed
        dispatch({
          type: "setScrollPosition",
          room_id: currentRoomScrollData.currentRoom,
          scrollPosition: currentRoomScrollData.scrollPosition,
        });
      }
      // changing current room to activeRoom
      setCurrentRoomScrollData({
        ...currentRoomScrollData,
        currentRoom: activeRoom,
        scrollPosition: {
          ...currentRoomScrollData.scrollPosition,
          previousScrollHeight: chatBodyRef.current.scrollHeight,
        },
      });

      // scrolling to first unread message if exists
      if (unreadMessagesRefsArray.current[0]) {
        // Scenario 1: (ACTIVE ROOM + NEW MESSAGES)
        // console.log("scroll to first unread");
        unreadMessagesRefsArray.current[0].scrollIntoView();
      } else {
        // Scenario 2: (ACTIVE ROOM + NO NEW MESSAGES)
        // scrolling to saved scroll position in chatData for the activeRoom
        chatBodyRef.current.scrollTo({
          top: currentRoomScrollData.scrollPosition.currentPosition,
        });
      }

      // stopping further execution for code readability
      return;
    }

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
        console.log("unread messages without refs cutoff");
        return;
      }

      console.log("New unread messages. Scenarios 3-4");
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
          previousScrollHeight: chatBodyRef.current.scrollHeight,
        },
      });

      // stopping further execution for code readability
      return;
    }

    // // TEST Scenario 5: (SAME ROOM + NEW HISTORY PAGE)
    // console.log("New history messages. Scenario 5");
    // // navigating to previous top of the page position
    // chatBodyRef.current.scrollTo({
    //   top:
    //     chatBodyRef.current.scrollHeight -
    //     currentRoomScrollData.scrollPosition.previousScrollHeight,
    // });

    // console.log(
    //   currentRoomScrollData.scrollPosition.previousScrollHeight,
    //   chatBodyRef.current.scrollHeight,
    //   chatBodyRef.current.scrollTop
    // );

    // setCurrentRoomScrollData({
    //   ...currentRoomScrollData,
    //   scrollPosition: {
    //     ...currentRoomScrollData.scrollPosition,
    //     previousScrollHeight: chatBodyRef.current.scrollHeight,
    //   },
    // });
  }, [activeRoom, readMessagesCount, unreadMessagesCount]);

  // TEST
  // useLayoutEffect(() => {
  //   console.log("ScrollHeight: ", chatBodyRef.current?.scrollHeight);
  // }, [chatBodyRef.current?.scrollHeight]);
}
