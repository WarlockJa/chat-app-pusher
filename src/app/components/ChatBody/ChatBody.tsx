import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useRef, useState } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";
import { isScrolledBottom } from "@/util/scrollFunctions";
import PaginationMarker from "./PaginationMarker";
import useScrollOnHistoryPageLoad from "../../../hooks/ChatBody/useScrollOnHistoryPageLoad";
import useScrollOnActiveRoomChange from "@/hooks/ChatBody/useScrollOnActiveRoomChange";
import useScrollOnNewMessage from "@/hooks/ChatBody/useScrollOnNewMessage";

export default function ChatBody({ userId }: { userId: IUserId }) {
  const { activeRoom } = useChatRoomsContext();
  const { chatData, dispatch } = useChatDataContext();

  // getting active room chat data
  const chatData_ActiveRoom = chatData?.find(
    (room) => room.room_id === activeRoom
  );

  const data: IChatData = chatData_ActiveRoom
    ? chatData_ActiveRoom
    : {
        room_id: activeRoom,
        messages: [],
        state: "loading",
        scrollPosition: {
          currentPosition: 0,
          isPreviousBottom: false,
          previousUnreadMsgCount: 0,
        },
        pagination: {
          hasMore: true,
          historyLoadedState: "success",
        },
      };

  // TODO pagination
  const paginationMarker = useRef<HTMLDivElement>(null);
  // refs array to unread <li> elements
  const unreadMessagesRefsArray = useRef<HTMLDivElement[]>([]);
  // reference for the top message to scroll to when new history page is loaded
  const topReadMessageMarker = useRef<HTMLDivElement>(null);
  // scrolling position of the chat__body div element
  const chatBodyRef = useRef<HTMLDivElement>(null);
  // current room state used to save last scroll position on activeRoom change
  const [currentRoomScrollData, setCurrentRoomScrollData] =
    useState<ICurrentRoomScrollData>({
      currentRoom: "",
      scrollPosition: {
        currentPosition: 0,
        isPreviousBottom: false,
        previousUnreadMsgCount: 0,
      },
    });

  // collecting scroll data for chat__body div element
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.target instanceof HTMLDivElement) {
      setCurrentRoomScrollData({
        ...currentRoomScrollData,
        scrollPosition: {
          ...currentRoomScrollData.scrollPosition,
          currentPosition: e.target.scrollTop,
          isPreviousBottom: isScrolledBottom(e.target),
        },
      });
    }
  };

  // read/unread messages to be displayed
  const readMessages = data.messages.filter((message) => !message.unread);
  const unreadMessages = data.messages.filter((message) => message.unread);

  /* 
    These hooks abstracts automatic scrolling inside ChatBody when either activeRoom or
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
      preserve current viewport position
  */
  // Scenarios: 1-2
  useScrollOnActiveRoomChange({
    activeRoom,
    chatBodyRef,
    currentRoomScrollData,
    dispatch,
    setCurrentRoomScrollData,
    unreadMessagesRefsArray,
    activeRoomScrollPosition: data.scrollPosition.currentPosition,
  });
  // Scenarios: 3-4
  useScrollOnNewMessage({
    currentRoomScrollData,
    setCurrentRoomScrollData,
    unreadMessagesRefsArray,
    unreadMessagesCount: unreadMessages.length,
  });
  // Scenario 5
  useScrollOnHistoryPageLoad({
    topReadMessageMarker,
    readMessages,
    activeRoom,
  });

  // initializing chatContent element
  let chatContent;
  if (data.state === "loading") {
    chatContent = (
      <div className="chat__body--spinnerWrapper">
        <Spinner />
      </div>
    );
  } else if (data.state === "error") {
    chatContent = "Error while loading messages from the database";
  } else {
    // timestamp for the last read message to compare with the first unread message
    const showFirstDate =
      readMessages.length > 0
        ? readMessages[readMessages.length - 1].timestamp
        : undefined;

    // messages data to display
    chatContent = data ? (
      <ul className="chatDisplay">
        {
          // pagintaion marker for chat data history
          data.pagination.historyLoadedState === "loading" ? (
            <div className="chat__body--spinnerWrapper">
              <Spinner />
            </div>
          ) : data.pagination.hasMore ? (
            <PaginationMarker
              paginationMarker={paginationMarker}
              user_id={userId.user_id}
              channel_name={activeRoom}
            />
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
          activeRoom={activeRoom}
          unreadMessagesRefsArray={unreadMessagesRefsArray}
          showFirstDate={showFirstDate}
          activeRoom_chatData={data}
        />
      </ul>
    ) : null;
  }
  return (
    <>
      {/* <button
        onClick={() => {
          // chatBodyRef.current?.scrollTo({
          //   top: 891,
          // });
          console.log(unreadMessagesRefsArray.current);
        }}
      >
        TEST
      </button> */}
      <div className="chat__body" ref={chatBodyRef} onScroll={handleScroll}>
        {chatContent}
      </div>
    </>
  );
}
