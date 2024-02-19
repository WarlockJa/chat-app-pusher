import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms/ChatRooms";
import SendForm from "./SendForm/SendForm";
import SubscriptionsHookWrapper from "./ChatBody/components/SubscriptionsHookWrapper";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import ChatHeader from "./ChatHeader/ChatHeader";

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
      <ChatRooms user_name={userId.user_name} user_id={userId.user_id} />
      <div className="chat__wrapper">
        <ChatHeader user_id={userId.user_id} user_name={userId.user_name} />
        <ChatBody userId={userId} />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
