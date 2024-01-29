/* 
This hook abstracts automatic scrolling inside ChatBody when either activeRoom or
the amount of messages to display changes
Possible scenarios include:
1 - Changing to the new active room that has new messages (ACTIVE ROOM + NEW MESSAGES):
  scrolling to the new message
2 - Changing to a new active room that has no new messages (ACTIVE ROOM + NO NEW MESSAGES):
  scrolling to the previous position saved for the room
3 - New message arrives when ChatBody is scrolled to the bottom (SAME ROOM + NEW MESSAGE + SCROLLED TO BOTTOM):
  scroll to the new bottom position
4 - New message arrives when ChatBody is not scrolled to the bottom (SAME ROOM + NEW MESSAGE + NOT SCROLLED TO BOTTOM):
  no scrolling required
5 - New history chat data page is loaded and added to the top (SAME ROOM + NEW HISTORY PAGE):
  preserve current viewport position
*/
import {
  IChatData,
  IChatDataSetScrollPosition,
} from "@/context/ChatDataProvider";
import { useLayoutEffect, useState } from "react";

export default function useScrollData({
  chatBodyRef,
  unreadMessagesRefsArray,
  currentRoomScrollData,
  setCurrentRoomScrollData,
  dispatch,
  activeRoom,
  data,
  unreadMessagesCount,
}: {
  chatBodyRef: React.RefObject<HTMLDivElement>;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLLIElement[]>;
  currentRoomScrollData: ICurrentRoomScrollData;
  setCurrentRoomScrollData: (data: ICurrentRoomScrollData) => void;
  dispatch: (action: IChatDataSetScrollPosition) => void;
  activeRoom: string;
  data: IChatData;
  unreadMessagesCount: number;
}) {
  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
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

      // scrolling to first unread message if exists
      if (unreadMessagesRefsArray.current[0]) {
        // Scenario 1: (ACTIVE ROOM + NEW MESSAGES)
        // console.log("scroll to first unread");
        unreadMessagesRefsArray.current[0].scrollIntoView();
      } else {
        // Scenario 2: (ACTIVE ROOM + NO NEW MESSAGES)
        // scrolling to saved scroll position in chatData for the activeRoom
        chatBodyRef.current.scrollTo({
          top: data.scrollPosition.currentPosition,
        });
      }

      // stopping further execution for code readability
      return;
    }

    // TODO add a cutoff if added messages new
    // new message in the same room. Scenarios 3-4
    if (unreadMessagesRefsArray.current[0]) {
      if (currentRoomScrollData.scrollPosition.isPreviousBottom) {
        // Scenario 3: (SAME ROOM + NEW MESSAGE + SCROLLED TO BOTTOM)
        // scrolling to bottom
        // console.log("scroll to bottom");
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
        });
      }

      // Scenario 4: (SAME ROOM + NEW MESSAGE + NOT SCROLLED TO BOTTOM)
      // doing nothing. Story: user is reading previous messages and scrolling would interfere with that.

      // stopping further execution for code readability
      return;
    }

    // Scenario 5: (SAME ROOM + NEW HISTORY PAGE)

    // if (currentRoomScrollData.scrollPosition.isPreviousBottom) {
    //   // Scenario 3: (SAME ROOM + NEW MESSAGE + SCROLLED TO BOTTOM)
    //   // console.log("scroll to bottom");
    //   chatBodyRef.current.scrollTo({
    //     top: chatBodyRef.current.scrollHeight,
    //   });
    // } else {
    //   // console.log("unread");
    //   // processing new chat history page loaded
    //   if (
    //     unreadMessagesRefsArray.current.length > 0 &&
    //     currentRoomScrollData.scrollPosition.previousScrollHeight !== 0
    //   ) {
    //     // console.log(
    //     //   "unread - scroll to previous top ",
    //     //   currentRoomScrollData.scrollPosition.previousScrollHeight,
    //     //   " - ",
    //     //   chatBodyRef.current.scrollHeight
    //     // );
    //     // scroll to previous top message
    //     chatBodyRef.current.scrollTo({
    //       top:
    //         chatBodyRef.current.scrollHeight -
    //         currentRoomScrollData.scrollPosition.previousScrollHeight,
    //     });
    //   } else {
    //     // console.log("history");
    //     // new chat history page
    //     // checking if this is a first batch of messages being loaded, if it is then we do not scroll
    //     if (currentRoomScrollData.scrollPosition.previousScrollHeight !== 0) {
    //       // console.log("history - scroll to previous top");
    //       // scroll to previous top message
    //       chatBodyRef.current.scrollTo({
    //         top: currentRoomScrollData.scrollPosition.previousScrollHeight,
    //       });
    //     }
    //   }
    //   // saving new chatBodyRef scrollHeight
    //   setCurrentRoomScrollData({
    //     ...currentRoomScrollData,
    //     scrollPosition: {
    //       ...currentRoomScrollData.scrollPosition,
    //       previousScrollHeight: chatBodyRef.current.scrollHeight,
    //     },
    //   });
    // }
  }, [activeRoom, data.messages.length]);
}
