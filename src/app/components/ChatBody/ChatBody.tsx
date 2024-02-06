import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useRef, useState } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";
import { isScrolledBottom } from "@/util/scrollFunctions";
import PaginationMarker from "./PaginationMarker";
import useChatBodyScroll from "@/hooks/ChatBody/useChatBodyScroll";

// TODO extract to Chat params
const PAGE_LIMIT = process.env.NEXT_PUBLIC_PAGE_LIMIT;

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
          currentPosition: 999999,
          isPreviousBottom: false,
          previousUnreadMsgCount: 0,
        },
        pagination: {
          historyLoadedState: "success",
          limit: PAGE_LIMIT ? Number(PAGE_LIMIT) : 10,
          totalCount: 0,
          pagesLoaded: 0,
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
        currentPosition: 999999,
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

  // automatic scrolling on activeRoom change or new messages added
  useChatBodyScroll({
    activeRoom,
    chatBodyRef,
    currentRoomScrollData,
    dispatch,
    setCurrentRoomScrollData,
    unreadMessagesRefsArray,
    activeRoomScrollPosition: data.scrollPosition.currentPosition,
    topReadMessageMarker,
    readMessages,
    unreadMessagesCount: unreadMessages.length,
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
    // TODO MOVE PAGINATION TO API FFS!!!1one!!
    // timestamp for the last read message to compare with the first unread message
    const showFirstDate =
      readMessages.length > 0
        ? readMessages[readMessages.length - 1].timestamp
        : undefined;

    // calculating if there's more history pages
    const hasMore =
      data.pagination.pagesLoaded < 1
        ? true
        : data.pagination.totalCount -
            (data.pagination.pagesLoaded - 1) * data.pagination.limit >
          0;

    // calculating amount of messages to skip, to fetch another history page
    // console.log(data.pagination);
    const skip =
      data.pagination.pagesLoaded < 1
        ? Number("init")
        : data.pagination.totalCount -
            data.pagination.pagesLoaded * data.pagination.limit <
          0
        ? 0
        : data.pagination.totalCount -
          data.pagination.pagesLoaded * data.pagination.limit;

    // adjusting the limit for the last page fetch
    const calculatedLimit =
      skip !== 0
        ? data.pagination.limit
        : data.pagination.totalCount -
          (data.pagination.pagesLoaded - 1) * data.pagination.limit;

    // messages data to display
    chatContent = data ? (
      <ul className="chatDisplay">
        {
          // pagintaion marker for chat data history
          data.pagination.historyLoadedState === "loading" ? (
            <div className="chat__body--spinnerWrapper">
              <Spinner />
            </div>
          ) : hasMore ? (
            <PaginationMarker
              paginationMarker={paginationMarker}
              user_id={userId.user_id}
              channel_name={activeRoom}
              limit={calculatedLimit}
              skip={skip}
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
          console.log(data.scrollPosition.currentPosition);
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
