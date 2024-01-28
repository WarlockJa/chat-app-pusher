import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import HooksElement from "./HooksElement";
import { PusherPresence } from "@/context/PusherProvider";

export default function Chat({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  // console.log("------------Chat rerender-------------");

  return (
    <div className="chat">
      <HooksElement pusher={pusher} userId={userId} />
      {/* <TestElement /> */}
      <ChatRooms user_id={userId.user_id} />
      <div className="chat__wrapper">
        <ChatBody userId={userId} />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
