import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import SubscriptionsHookWrapper from "./SubscriptionsHookWrapper";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import TypingNotifications from "./TypingNotifications/TypingNotifications";

export default function Chat({
  userId,
  pusher,
  pageLimit,
}: {
  userId: IUserId;
  pusher: PusherPresence;
  pageLimit: number;
}) {
  // console.log("------------Chat rerender-------------");

  return (
    <div className="chat">
      <SubscriptionsHookWrapper pusher={pusher} userId={userId} />
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody userId={userId} pageLimit={pageLimit} />
        <TypingNotifications />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
