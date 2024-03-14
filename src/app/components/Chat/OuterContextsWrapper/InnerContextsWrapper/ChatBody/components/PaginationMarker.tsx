import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { getChannelHistoryMessages } from "@/lib/apiDBMethods/getChannelHistoryMessages";

export default function PaginationMarker({
  paginationMarker,
  channel_name,
  limit,
  message_id,
}: {
  paginationMarker: React.RefObject<HTMLDivElement>;
  channel_name: string;
  limit: number;
  message_id: string | null;
}) {
  const { dispatchChatData } = useChatDataContext();
  const { dispatchPagination } = usePaginationContext();

  // callback for the pagination marker intersection event
  const handleMarkerIntersection = () => {
    // changing pagination state to loading
    dispatchPagination({
      type: "setPaginationData",
      roomName: channel_name,
      state: "loading",
    });

    // fetching new chat data history page
    getChannelHistoryMessages({
      dispatchChatData,
      dispatchPagination,
      params: {
        channel_name,
        limit,
        message_id,
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
