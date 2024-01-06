import ChatBody from "./ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import Pusher from "pusher-js/types/src/core/pusher";
import useSubscriptions from "@/hooks/useSubscriptions";
import useChatData from "@/hooks/useChatData";
import HooksElement from "./HooksElement";

// TODO rename TS everywhere
export default function Chat({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: Pusher;
}) {
  console.log("------------Chat rerender-------------");

  // TODO need a hook that would return activeRoom, setActiveRoom, activeRoomChatData, roomsList
  // hook should replace chatRooms anc chatData contexts to avoid Chat rerender.
  // const { activeRoom, setActiveRoom, activeRoomChatData, roomsList } =
  //   useChatData({ userId, pusher });

  return (
    <div className="chat">
      <HooksElement pusher={pusher} userId={userId} />
      {/* <TestElement /> */}
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm userId={userId} />
      </div>
    </div>
  );
}
