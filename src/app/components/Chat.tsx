"use client";
import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";
import NoUserPlug from "./NoUserPlug";
import { IUserId } from "@/lib/localState";
import LoadingPlug from "./LoadingPlug";
import usePusherConnection from "@/hooks/usePusherConnection";
import useUserId from "@/hooks/useUserId";
import useChatData from "@/hooks/useChatData";
import useSubscriptions from "@/hooks/useSubscriptions";

interface IChatProps extends IUserId {
  storage_uuid: string;
}

export default function Chat({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
}: IChatProps) {
  // populating state with user data
  const { loading } = useUserId({
    storage_uuid,
    user_id,
    user_name,
    user_admin,
  });
  // initiating pusher connection
  const { pusher } = usePusherConnection();
  // managing channel subscriptions
  const {} = useSubscriptions();
  // fetching db data
  const { chatData } = useChatData();

  // return <TestElement />;

  if (!loading) return <LoadingPlug />;

  if (!pusher) return <NoUserPlug storage_uuid={storage_uuid} />;

  return (
    <div className="chat">
      {/* <ChatRooms /> */}
      {/* <div className="chat__wrapper">
        <ChatBody />
        <SendForm />
      </div> */}
    </div>
  );
}
