"use client";
import "./chat.scss";
import NoUserPlug from "./plugs/NoUserPlug";
import LoadingPlug from "./plugs/LoadingPlug";
import usePusherConnection from "@/hooks/usePusherConnection";
import useUserId from "@/hooks/useUserId";
import { usePusherContext } from "@/context/outerContexts/PusherProvider";
import { useUserIdContext } from "@/context/outerContexts/UserIdProvider";
import { ChatRoomsProvider } from "@/context/innerContexts/ChatRoomsProvider";
import { ChatDataProvider } from "@/context/innerContexts/ChatDataProvider";
import Chat from "./Chat";

export default function ChatWrapper({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
  pageLimit,
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

  // initiating pusher connection
  usePusherConnection();

  // showing loading screen while processing userId
  if (loadingUserId) return <LoadingPlug message="Loading user data" />;

  // show local authentication element for anonymous user
  if (!userId) return <NoUserPlug storage_uuid={storage_uuid!} />;

  if (!pusher) return <LoadingPlug message="Establishing Pusher connection" />;

  return (
    <ChatRoomsProvider userId={userId}>
      <ChatDataProvider pageLimit={pageLimit ? pageLimit : 30}>
        <Chat
          userId={userId}
          pusher={pusher}
          pageLimit={pageLimit ? pageLimit : 30}
        />
      </ChatDataProvider>
    </ChatRoomsProvider>
  );
}
