import { IChatData_MessageExtended } from "@/context/ChatDataProvider";
import { useEffect, useLayoutEffect, useRef } from "react";

interface IUseScrollOnHistoryPageLoadProps {
  topReadMessageMarker: React.RefObject<HTMLDivElement>;
  readMessages: IChatData_MessageExtended[];
  activeRoom: string;
}

export default function useScrollOnHistoryPageLoad({
  topReadMessageMarker,
  readMessages,
  activeRoom,
}: IUseScrollOnHistoryPageLoadProps) {
  const previousTopMsgRef = useRef<HTMLDivElement | null>(null);

  // reset previous top message ref on activeRoom change
  useEffect(() => {
    previousTopMsgRef.current = null;
  }, [activeRoom]);

  // scrolling to previoust top on new history page load
  useLayoutEffect(() => {
    if (!topReadMessageMarker.current) return;

    // scrolling into view previous top message
    if (
      previousTopMsgRef.current &&
      previousTopMsgRef.current !== topReadMessageMarker.current
    ) {
      previousTopMsgRef.current.scrollIntoView();
    }
    // saving current top message ref to previousTopMsgRef
    previousTopMsgRef.current = topReadMessageMarker.current;
  }, [topReadMessageMarker.current, readMessages.length]);
}
