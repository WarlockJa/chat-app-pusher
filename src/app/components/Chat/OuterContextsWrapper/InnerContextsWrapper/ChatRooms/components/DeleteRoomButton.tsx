import DeleteCross from "@/assets/svg/DeleteCross";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useScrollPositionDataContext } from "@/context/innerContexts/ScrollPositionProvider";
import { useUsersTypingContext } from "@/context/innerContexts/UsersTypingProvider";
import deleteChannel from "@/lib/apiDBMethods/deleteChannel";
import React from "react";

export default function DeleteRoomButton({
  roomName,
  user_id,
}: {
  roomName: string;
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
        if (activeRoom === roomName) setActiveRoom(`presence-${user_id}`);
        // delete room from DB
        deleteChannel({ channel_name: roomName });
        // delete room from ChatData
        dispatchChatData({ type: "ChatData_deleteRoom", roomName });
        // delete room from ChatRooms
        dispatchChatRooms({ type: "ChatRooms_deleteRoom", roomName });
        // delete room from Pagination
        dispatchPagination({
          type: "Pagination_deleteRoom",
          roomName: roomName,
        });
        // delete room from ScrollPosition
        dispatchScrollPosition({
          type: "ScrollPosition_deleteRoom",
          roomName,
        });
        // delete room from UsersTyping
        dispatchUsersTyping({
          type: "UsersTyping_deleteRoom",
          roomName,
        });
      }}
    >
      <DeleteCross />
    </div>
  );
}
