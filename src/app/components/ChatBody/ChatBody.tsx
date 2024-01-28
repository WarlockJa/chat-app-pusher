import "./chatbody.scss";
import { IChatData, useChatDataContext } from "@/context/ChatDataProvider";
import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import Spinner from "@/util/Spinner";
import { useLayoutEffect, useRef, useState } from "react";
import ChatBodyReadMessages from "./ChatBodyReadMessages";
import ChatBodyUnreadMessages from "./ChatBodyUnreadMessages";
import { isScrolledBottom } from "@/util/scrollFunctions";
import PaginationMarker from "./PaginationMarker";

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
  // processing scrolling when new message is added to the active room
  useLayoutEffect(() => {
    if (!chatBodyRef.current) return;
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
      // active room change
      // scrolling to first unread message if present
      if (unreadMessagesRefsArray.current[0]) {
        // console.log("scroll to first unread");
        unreadMessagesRefsArray.current[0].scrollIntoView();
      } else {
        // console.log(
        //   "scroll to last position ",
        //   data.scrollPosition.currentPosition
        // );
        // scrolling to saved scroll position in chatData for the activeRoom
        chatBodyRef.current.scrollTo({
          top: data.scrollPosition.currentPosition,
        });
      }
    } else {
      // new messages in the same room
      if (currentRoomScrollData.scrollPosition.isPreviousBottom) {
        // console.log("scroll to bottom");
        // new message
        chatBodyRef.current.scrollTo({
          top: chatBodyRef.current.scrollHeight,
        });
      } else {
        // console.log("unread");
        // processing new chat history page loaded
        if (
          unreadMessagesRefsArray.current.length > 0 &&
          currentRoomScrollData.scrollPosition.previousScrollHeight !== 0
        ) {
          // console.log(
          //   "unread - scroll to previous top ",
          //   currentRoomScrollData.scrollPosition.previousScrollHeight,
          //   " - ",
          //   chatBodyRef.current.scrollHeight
          // );
          // scroll to previous top message
          chatBodyRef.current.scrollTo({
            top:
              chatBodyRef.current.scrollHeight -
              currentRoomScrollData.scrollPosition.previousScrollHeight,
          });
        } else {
          // console.log("history");
          // new chat history page
          // checking if this is a first batch of messages being loaded, if it is then we do not scroll
          if (currentRoomScrollData.scrollPosition.previousScrollHeight !== 0) {
            // console.log("history - scroll to previous top");
            // scroll to previous top message
            chatBodyRef.current.scrollTo({
              top: currentRoomScrollData.scrollPosition.previousScrollHeight,
            });
          }
        }
        // saving new chatBodyRef scrollHeight
        setCurrentRoomScrollData({
          ...currentRoomScrollData,
          scrollPosition: {
            ...currentRoomScrollData.scrollPosition,
            previousScrollHeight: chatBodyRef.current.scrollHeight,
          },
        });
      }
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
    <div className="chat__body" ref={chatBodyRef} onScroll={handleScroll}>
      {/* <button
        onClick={() =>
          console.log(unreadMessagesRefsArray.current[0].offsetTop)
        }
      >
        TEST
      </button> */}
      {chatContent}
    </div>
  );
}
