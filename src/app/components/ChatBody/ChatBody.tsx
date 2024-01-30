import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useRef, useState } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";
import { isScrolledBottom } from "@/util/scrollFunctions";
import PaginationMarker from "./PaginationMarker";
import useScrollData from "../../../hooks/ChatBody/useScrollData";

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
          previousScrollHeight: 0,
          previousReadMsgCount: 0,
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
  const unreadMessagesRefsArray = useRef<HTMLLIElement[]>([]);
  // scrolling position of the chat__body div element
  const chatBodyRef = useRef<HTMLDivElement>(null);
  // current room state used to save last scroll position on activeRoom change
  const [currentRoomScrollData, setCurrentRoomScrollData] =
    useState<ICurrentRoomScrollData>({
      currentRoom: "",
      scrollPosition: {
        currentPosition: 0,
        isPreviousBottom: false,
        previousScrollHeight: 0,
        previousReadMsgCount: 0,
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

  // processing chatBody scrolling into view when active room changes or new messages arrive
  useScrollData({
    chatBodyRef,
    activeRoom,
    currentRoomScrollData,
    // data,
    dispatch,
    setCurrentRoomScrollData,
    unreadMessagesRefsArray,
    unreadMessagesCount: unreadMessages.length,
    readMessagesCount: readMessages.length,
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
    const showFirstDate =
      readMessages.length > 0
        ? readMessages[readMessages.length - 1].timestamp
        : undefined;
    // const showFirstDate =
    //   readMessages.length > 0 && unreadMessages.length > 0
    //     ? readMessages[readMessages.length - 1].timestamp !==
    //       unreadMessages[0].timestamp
    //     : false;

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
        />
        <ChatBodyUnreadMessages
          unreadMessages={unreadMessages}
          user_id={userId.user_id}
          activeRoom={activeRoom}
          unreadMessagesRefsArray={unreadMessagesRefsArray}
          showFirstDate={showFirstDate}
        />
      </ul>
    ) : null;
  }
  return (
    <>
      <button
        onClick={() => {
          // chatBodyRef.current?.scrollTo({
          //   top: 891,
          // });
          console.log(chatBodyRef.current?.scrollHeight);
        }}
      >
        TEST
      </button>
      <div className="chat__body" ref={chatBodyRef} onScroll={handleScroll}>
        {chatContent}
      </div>
    </>
  );
}
