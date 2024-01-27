import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useLayoutEffect, useRef, useState } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";
import { isScrolledBottom } from "@/util/scrollFunctions";

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
        scrollPosition: { currentPosition: 0, isPreviousBottom: false },
      };

  // TODO pagination
  const paginationMarker = useRef(null);
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
      },
    });

  // collecting scroll data for chat__body div element
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.target instanceof HTMLDivElement) {
      setCurrentRoomScrollData({
        ...currentRoomScrollData,
        scrollPosition: {
          currentPosition: e.target.scrollTop,
          isPreviousBottom: isScrolledBottom(e.target),
        },
      });
    }
  };
  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
    // processing activeRoom change
    // saving scroll data to previous room if existed
    if (currentRoomScrollData.currentRoom !== "") {
      dispatch({
        type: "setScrollPosition",
        room_id: currentRoomScrollData.currentRoom,
        scrollPosition: currentRoomScrollData.scrollPosition,
      });
    }
    // changing current room to activeRoom
    setCurrentRoomScrollData({
      ...currentRoomScrollData,
      currentRoom: activeRoom,
    });

    // separating activeRoom change and new message in the same room events
    if (activeRoom !== currentRoomScrollData.currentRoom) {
      // scrolling to first unread message if present
      if (unreadMessagesRefsArray.current[0]) {
        unreadMessagesRefsArray.current[0].scrollIntoView();
      } else {
        // scrolling to saved scroll position in chatData for the activeRoom
        chatBodyRef.current?.scrollTo({
          top: data.scrollPosition.currentPosition,
        });
      }
    } else {
      // processing new message in the currently active room
      if (!currentRoomScrollData.scrollPosition.isPreviousBottom) return;
      chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight });
    }
  }, [activeRoom, data.messages.length]);

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
    // read/unread messages to be displayed
    const readMessages = data.messages.filter((message) => !message.unread);
    const unreadMessages = data.messages.filter((message) => message.unread);

    chatContent = data ? (
      <ul className="chatDisplay">
        <div ref={paginationMarker}></div>

        <ChatBodyReadMessages
          readMessages={readMessages}
          user_id={userId.user_id}
        />
        <ChatBodyUnreadMessages
          unreadMessages={unreadMessages}
          user_id={userId.user_id}
          activeRoom={activeRoom}
          unreadMessagesRefsArray={unreadMessagesRefsArray}
        />
      </ul>
    ) : null;
  }
  return (
    <div className="chat__body" ref={chatBodyRef} onScroll={handleScroll}>
      {/* <button
        onClick={() =>
          console.log(
            chatBodyRef.current?.scrollTop,
            testRef.current.getBoundingClientRect()
          )
        }
      >
        TEST
      </button> */}
      {chatContent}
    </div>
  );
}
