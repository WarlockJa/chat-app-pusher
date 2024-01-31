import { useChatDataContext } from "@/context/ChatDataProvider";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { getChannelHistoryMessages } from "@/lib/apiDBMethods";

export default function PaginationMarker({
  paginationMarker,
  user_id,
  channel_name,
}: {
  paginationMarker: React.RefObject<HTMLDivElement>;
  user_id: string;
  channel_name: string;
}) {
  const { dispatch: dispatchChatData } = useChatDataContext();

  // callback for the pagination marker intersection event
  const handleMarkerIntersection = () => {
    // chat history loaded flag
    dispatchChatData({
      type: "setPaginationState",
      room_id: channel_name,
      newState: "loading",
    });

    // fetching new chat data history page
    getChannelHistoryMessages({
      dispatchChatData,
      params: {
        user_id,
        channel_name,
      },
    });
  };

  // using Intersection Observer hook to handle pagination
  useIntersectionObserver({
    callback: handleMarkerIntersection,
    observableHTMLDivElement: paginationMarker,
  });

  return <div ref={paginationMarker}></div>;
}
