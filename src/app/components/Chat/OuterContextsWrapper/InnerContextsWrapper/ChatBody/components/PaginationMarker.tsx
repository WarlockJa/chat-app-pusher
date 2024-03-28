import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { useKnownUsersContext } from "@/context/innerContexts/KnownUsersProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { apiDB_getChannelHistoryMessages } from "@/lib/apiDBMethods/apiDB_getChannelHistoryMessages";

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
  const { dispatchKnownUsers } = useKnownUsersContext();
  const { dispatchChatRooms } = useChatRoomsContext();
  const { userId } = useUserIdContext();

  // callback for the pagination marker intersection event
  const handleMarkerIntersection = () => {
    // changing pagination state to loading
    dispatchPagination({
      type: "setPaginationData",
      roomName: channel_name,
      state: "loading",
    });

    // fetching new chat data history page
    apiDB_getChannelHistoryMessages({
      dispatchChatData,
      dispatchPagination,
      params: {
        channel_name,
        limit,
        message_id,
      },
      dispatchChatRooms,
      dispatchKnownUsers,
      accessToken: { user_admin: userId?.user_admin, user_id: userId?.user_id },
    });
  };

  // using Intersection Observer hook to handle pagination
  useIntersectionObserver({
    callback: handleMarkerIntersection,
    observableHTMLDivElement: paginationMarker,
  });

  return <div ref={paginationMarker}></div>;
}
