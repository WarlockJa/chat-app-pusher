"use client";
import "./chat.scss";
import NoUserPlug from "./plugs/NoUserPlug";
import LoadingPlug from "./plugs/LoadingPlug";
import usePusherConnection from "@/hooks/usePusherConnection";
import useUserId from "@/hooks/useUserId";
import { usePusherContext } from "@/context/PusherProvider";
import { useUserIdContext } from "@/context/UserIdProvider";
import { ChatRoomsProvider } from "@/context/ChatRoomsProvider";
import { ChatDataProvider } from "@/context/ChatDataProvider";
import Chat from "./Chat";
import { SWRConfig } from "swr";

export default function ChatWrapper({
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

  // initiating pusher connection
  usePusherConnection();

  // showing loading screen while processing userId
  if (loadingUserId) return <LoadingPlug message="Loading user data" />;

  // show local authentication element for anonymous user
  if (!userId) return <NoUserPlug storage_uuid={storage_uuid!} />;

  if (!pusher) return <LoadingPlug message="Establishing Pusher connection" />;

  return (
    <ChatRoomsProvider userId={userId}>
      <ChatDataProvider>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <Chat userId={userId} pusher={pusher} />
        </SWRConfig>
      </ChatDataProvider>
    </ChatRoomsProvider>
  );
}
