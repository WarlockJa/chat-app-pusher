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
      scrolling to the previous top message
    6 - History page is loaded and there are no other messages to scoll to (SAME ROOM + NEW HISTORY PAGE + NO DATA):
      scrolling to the bottom
  */
import {
  IChatDataSetScrollPosition,
  IChatData_MessageExtended,
} from "@/context/innerContexts/ChatDataProvider";
import { useLayoutEffect, useRef } from "react";

interface IUseChatBodyScrollProps {
  // 1-2
  chatBodyRef: React.RefObject<HTMLDivElement>;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  currentRoomScrollData: ICurrentRoomScrollData;
  setCurrentRoomScrollData: (data: ICurrentRoomScrollData) => void;
  dispatch: (action: IChatDataSetScrollPosition) => void;
  activeRoom: string;
  activeRoomScrollPosition: number;
  // 3-4
  unreadMessagesCount: number;
  // 5-6
  topReadMessageMarker: React.RefObject<HTMLDivElement>;
  readMessages: IChatData_MessageExtended[];
}

export default function useChatBodyScroll({
  activeRoom,
  activeRoomScrollPosition,
  chatBodyRef,
  currentRoomScrollData,
  dispatch,
  setCurrentRoomScrollData,
  unreadMessagesRefsArray,
  topReadMessageMarker,
  readMessages,
  unreadMessagesCount,
}: IUseChatBodyScrollProps) {
  // reference to be used in scenario 5 to navigate to the previous top comment
  const previousTopMsgRef = useRef<HTMLDivElement | null>(null);

  // processing scrolling when active room is changing
  useLayoutEffect(() => {
    // not initiating scroll events if no element to scroll
    if (!chatBodyRef.current) return;

    // active room change. Scenarios 1-2
    if (activeRoom !== currentRoomScrollData.currentRoom) {
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
      });
      // reset previous top message ref on activeRoom change
      previousTopMsgRef.current = null;

      // scrolling to first unread message if exists
      if (unreadMessagesRefsArray.current[0]) {
        // console.log("Scenario 1");
        // Scenario 1: (ACTIVE ROOM + NEW MESSAGES)
        unreadMessagesRefsArray.current[0].scrollIntoView();
      } else {
        // console.log("Scenario 2");
        // Scenario 2: (ACTIVE ROOM + NO NEW MESSAGES)
        // scrolling to saved scroll position in chatData for the activeRoom
        chatBodyRef.current.scrollTo({
          top: activeRoomScrollPosition,
        });
      }

      // preventing code from further execution
      return;
    }

    // Scenarios 3-4
    // checking that added unread message is a new one
    if (
      currentRoomScrollData.scrollPosition.previousUnreadMsgCount !==
      unreadMessagesCount
    ) {
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

      // preventing code from further execution
      return;
    }

    // Scenarios 5-6
    if (
      topReadMessageMarker.current?.textContent !==
      previousTopMsgRef.current?.textContent
    ) {
      // scrolling into view previous top message
      if (previousTopMsgRef.current) {
        // console.log("Scenario 5");
        // Scenario 5 (SAME ROOM + NEW HISTORY PAGE)
        previousTopMsgRef.current.scrollIntoView();

        // scrolling to offset post header height
        const tempScrollTopData = chatBodyRef.current.scrollTop;
        chatBodyRef.current.scrollTo({
          top: tempScrollTopData - 45,
        });
      } else {
        // console.log("Scenario 6");
        // In order to avoid collision with scenario 2 (scrolling to saved position on activeRoom change)
        // checking that activeRoomScrollPosition is set to a default value
        // This way we ensure that conditions are correct for the scenario 6
        if (activeRoomScrollPosition === 999999)
          // Scenario 6 (SAME ROOM + NEW HISTORY PAGE + NO DATA)
          chatBodyRef.current?.scrollTo({
            top: chatBodyRef.current.scrollHeight,
          });
      }
      // saving current top message ref to previousTopMsgRef
      previousTopMsgRef.current = topReadMessageMarker.current;

      // preventing code from further execution
      return;
    }
  }, [
    activeRoom,
    topReadMessageMarker.current,
    readMessages.length,
    unreadMessagesCount,
  ]);
}
