import ChatBody from "./ChatBody";
import ChatRooms from "./ChatRooms";
import SendForm from "./SendForm";
import HooksElement from "./HooksElement";
import { PusherPresence } from "@/context/PusherProvider";

// TODO rename TS everywhere
export default function Chat({
  userId,
  pusher,
}: {
  userId: IUserId;
  pusher: PusherPresence;
}) {
  console.log("------------Chat rerender-------------");

  return (
    <div className="chat">
      <HooksElement pusher={pusher} userId={userId} />
      {/* <TestElement /> */}
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm userId={userId} pusher={pusher} />
      </div>
    </div>
  );
}
