import useChatData from "@/hooks/useChatData";
import ChatBody from "./ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import useSubscriptions from "@/hooks/useSubscriptions";

// TODO rename TS everywhere
export default function Chat({ userId, pusher }: IHookProps) {
  // initializing subscriptions processing
  useSubscriptions({ userId, pusher });
  useChatData({ userId, pusher });
  return (
    <div className="chat">
      {/* <TestElement /> */}
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm userId={userId} />
      </div>
    </div>
  );
}
