import { IChatDataSetScrollPosition } from "@/context/ChatDataProvider";
import { useLayoutEffect } from "react";

export default function useScrollOnActiveRoomChange({
  chatBodyRef,
  unreadMessagesRefsArray,
  currentRoomScrollData,
  setCurrentRoomScrollData,
  dispatch,
  activeRoom,
  activeRoomScrollPosition,
}: {
  chatBodyRef: React.RefObject<HTMLDivElement>;
  unreadMessagesRefsArray: React.MutableRefObject<HTMLDivElement[]>;
  currentRoomScrollData: ICurrentRoomScrollData;
  setCurrentRoomScrollData: (data: ICurrentRoomScrollData) => void;
  dispatch: (action: IChatDataSetScrollPosition) => void;
  activeRoom: string;
  activeRoomScrollPosition: number;
}) {
  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
    if (!chatBodyRef.current) return;
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

    // active room change. Scenarios 1-2
    // scrolling to first unread message if exists
    if (unreadMessagesRefsArray.current[0]) {
      // Scenario 1: (ACTIVE ROOM + NEW MESSAGES)
      unreadMessagesRefsArray.current[0].scrollIntoView();
    } else {
      // Scenario 2: (ACTIVE ROOM + NO NEW MESSAGES)
      // scrolling to saved scroll position in chatData for the activeRoom
      chatBodyRef.current.scrollTo({
        top: activeRoomScrollPosition,
      });
    }
  }, [activeRoom]);
}
