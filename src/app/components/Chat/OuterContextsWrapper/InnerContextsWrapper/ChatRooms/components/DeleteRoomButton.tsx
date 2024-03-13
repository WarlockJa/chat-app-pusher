import DeleteCross from "@/assets/svg/DeleteCross";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useScrollPositionDataContext } from "@/context/innerContexts/ScrollPositionProvider";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import deleteChannel from "@/lib/apiDBMethods/deleteChannel";
import React from "react";

export default function DeleteRoomButton({
  room_id,
  user_id,
}: {
  room_id: string;
  user_id: string;
}) {
  const { dispatchChatData } = useChatDataContext();
  const { dispatchChatRooms, activeRoom, setActiveRoom } =
    useChatRoomsContext();
  const { dispatchPagination } = usePaginationContext();
  const { dispatchScrollPosition } = useScrollPositionDataContext();
  const { dispatchUsersTyping } = useUsersTypingContext();
  return (
    <div
      className="chat__rooms--delete"
      title="delete room"
      onClick={(e) => {
        e.stopPropagation();
        if (activeRoom === room_id) setActiveRoom(`presence-${user_id}`);
        // delete room from DB
        deleteChannel({ channel_name: room_id });
        // delete room from ChatData
        dispatchChatData({ type: "ChatData_deleteRoom", room_id });
        // delete room from ChatRooms
        dispatchChatRooms({ type: "ChatRooms_deleteRoom", room_id });
        // delete room from Pagination
        dispatchPagination({ type: "Pagination_deleteRoom", room_id });
        // delete room from ScrollPosition
        dispatchScrollPosition({ type: "ScrollPosition_deleteRoom", room_id });
        // delete room from UsersTyping
        dispatchUsersTyping({ type: "UsersTyping_deleteRoom", room_id });
      }}
    >
      <DeleteCross />
    </div>
  );
}
