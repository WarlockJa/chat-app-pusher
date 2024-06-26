import "./chatbody.scss";
import { useChatDataContext } from "@/context/innerContexts/ChatDataProvider";
import { useChatRoomsContext } from "@/context/innerContexts/ChatRoomsProvider";
import SpinnerCircle from "@/util/spinners/SpinnerCircle";
import { useRef, useState } from "react";
import ChatBodyReadMessages from "./components/ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./components/ChatBodyUnreadMessages";
import PaginationMarker from "./components/PaginationMarker";
import useChatBodyScroll from "@/hooks/ChatBody/useChatBodyScroll";
import SpinnerFlat from "@/util/spinners/SpinnerFlat";
import { usePaginationContext } from "@/context/innerContexts/PaginationProvider";
import { useScrollPositionDataContext } from "@/context/innerContexts/ScrollPositionProvider";
import { TPrisma_ScrollPosition, TPrisma_User } from "@/lib/prisma/prisma";
import { isScrolledBottom } from "./utils/scrollFunctions";

export default function ChatBody({ userId }: { userId: TPrisma_User }) {
  const { activeRoom } = useChatRoomsContext();
  const { getRoomChatData } = useChatDataContext();
  const { getRoomPaginationData } = usePaginationContext();
  const { getRoomScrollPositionData, dispatchScrollPosition } =
    useScrollPositionDataContext();

  // getting active room chat data
  const dataMessages = getRoomChatData(activeRoom);
  const dataPagination = getRoomPaginationData(activeRoom);
  const dataScrollPosition = getRoomScrollPositionData(activeRoom);

  // pagination marker
  const paginationMarker = useRef<HTMLDivElement>(null);
  // refs array to unread <li> elements
  const unreadMessagesRefsArray = useRef<HTMLDivElement[]>([]);
  // reference for the top message to scroll to when new history page is loaded
  const topReadMessageMarker = useRef<HTMLDivElement>(null);
  // scrolling position of the chat__body div element
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // current room state used to save last scroll position on activeRoom change
  const [currentRoomScrollData, setCurrentRoomScrollData] =
    useState<TPrisma_ScrollPosition>({
      name: "",
      currentPosition: 999999,
      isPreviousBottom: false,
      previousUnreadMsgCount: 0,
    });

  // collecting scroll data for chat__body div element
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.target instanceof HTMLDivElement) {
      setCurrentRoomScrollData({
        ...currentRoomScrollData,
        currentPosition: e.target.scrollTop,
        isPreviousBottom: isScrolledBottom(e.target),
      });
    }
  };

  // read/unread messages to be displayed
  const readMessages = dataMessages.messages.filter(
    (message) => !message.unread
  );
  const unreadMessages = dataMessages.messages.filter(
    (message) => message.unread
  );

  // automatic scrolling on activeRoom change or new messages added
  useChatBodyScroll({
    activeRoom,
    chatBodyRef,
    currentRoomScrollData,
    dispatchScrollPosition,
    setCurrentRoomScrollData,
    unreadMessagesRefsArray,
    activeRoomScrollPosition: dataScrollPosition.currentPosition,
    topReadMessageMarker,
    readMessages,
    unreadMessagesCount: unreadMessages.length,
  });

  // initializing chatContent element
  let chatContent;
  if (dataMessages.state === "loading") {
    chatContent = (
      <div className="chat__body--spinnerWrapper">
        <SpinnerCircle />
      </div>
    );
  } else if (dataMessages.state === "error") {
    chatContent = "Error while loading messages from the database";
  } else {
    // timestamp for the last read message to compare with the first unread message
    const showFirstDate =
      readMessages.length > 0
        ? readMessages[readMessages.length - 1].timestamp
        : undefined;

    // messages data to display
    chatContent = (
      <ul className="chatDisplay">
        {
          // pagintaion marker for chat data history
          dataPagination.state === "loading" ? (
            <div className="chat__body--spinnerWrapper">
              <SpinnerFlat />
            </div>
          ) : dataPagination.hasMore ? (
            currentRoomScrollData.name === activeRoom ? (
              <PaginationMarker
                paginationMarker={paginationMarker}
                channel_name={activeRoom}
                limit={dataPagination.limit}
                message_id={
                  dataMessages.messages[0] ? dataMessages.messages[0].id : null
                }
              />
            ) : null
          ) : null
        }
        <ChatBodyReadMessages
          readMessages={readMessages}
          user_id={userId.user_id}
          topReadMessageMarker={topReadMessageMarker}
        />
        <ChatBodyUnreadMessages
          unreadMessages={unreadMessages}
          user_id={userId.user_id}
          user_admin={userId.user_admin}
          activeRoom={activeRoom}
          unreadMessagesRefsArray={unreadMessagesRefsArray}
          showFirstDate={showFirstDate}
          activeRoom_chatData={dataMessages}
        />
      </ul>
    );
  }
  return (
    <div className="chat__body" ref={chatBodyRef} onScroll={handleScroll}>
      {chatContent}
    </div>
  );
}
