import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import SubscriptionsHookWrapper from "./SubscriptionsHookWrapper";
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
      <SubscriptionsHookWrapper pusher={pusher} userId={userId} />
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody userId={userId} />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
