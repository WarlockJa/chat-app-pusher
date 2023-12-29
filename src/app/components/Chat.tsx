import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";
import NoUserPlug from "./plugs/NoUserPlug";
import LoadingPlug from "./plugs/LoadingPlug";
import usePusherConnection from "@/hooks/usePusherConnection";
import useUserId from "@/hooks/useUserId";
import useChatData from "@/hooks/useChatData";
import useSubscriptions from "@/hooks/useSubscriptions";
import { usePusherContext } from "@/context/PusherProvider";
export default function Chat({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
}: IChatProps) {
  // populating state with user data
  const { loadingUserId } = useUserId({
    storage_uuid,
    user_id,
    user_name,
    user_admin,
  });

  // initiating pusher connection
  usePusherConnection();
  const pusher = usePusherContext();
  // managing channel subscriptions
  useSubscriptions();
  // fetching db data
  useChatData();

  // return <TestElement />;

  // showing loading screen while processing userId
  if (loadingUserId) return <LoadingPlug />;

  // show local authentication element for anonymous user
  if (!pusher.pusher) return <NoUserPlug storage_uuid={storage_uuid!} />;

  return (
    <div className="chat">
      {/* <ChatRooms /> */}
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm />
      </div>
    </div>
  );
}
