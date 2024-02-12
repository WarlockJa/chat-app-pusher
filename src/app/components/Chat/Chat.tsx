import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms/ChatRooms";
import SendForm from "./SendForm/SendForm";
import SubscriptionsHookWrapper from "./ChatBody/components/SubscriptionsHookWrapper";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import TypingNotifications from "./TypingNotifications/TypingNotifications";

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
        <TypingNotifications />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
