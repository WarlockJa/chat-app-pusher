import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";
import NoUserPlug from "./plugs/NoUserPlug";
import LoadingPlug from "./plugs/LoadingPlug";
import usePusherConnection from "@/hooks/usePusherConnection";
import useUserId from "@/hooks/useUserId";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import Initializer from "./Initializer";
import { ChatRoomsProvider } from "@/context/ChatRoomsProvider";
import { ChatDataProvider } from "@/context/ChatDataProvider";

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
  const { userId } = useUserIdContext();
  const { pusher } = usePusherContext();

  console.log("---------------Chat rerender--------------");

  // initiating pusher connection
  usePusherConnection();

  // showing loading screen while processing userId
  if (loadingUserId) return <LoadingPlug message="Loading user data" />;

  // show local authentication element for anonymous user
  if (!userId) return <NoUserPlug storage_uuid={storage_uuid!} />;

  if (!pusher) return <LoadingPlug message="Establishing Pusher connection" />;

  return (
    <ChatRoomsProvider>
      <ChatDataProvider>
        <div className="chat">
          <Initializer userId={userId} pusher={pusher} />
          {/* <TestElement /> */}
          <ChatRooms />
          <div className="chat__wrapper">
            <ChatBody />
            <SendForm userId={userId} />
          </div>
        </div>
      </ChatDataProvider>
    </ChatRoomsProvider>
  );
}
