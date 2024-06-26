import ChatBody from "./ChatBody/ChatBody";
import ChatRooms from "./ChatRooms/ChatRooms";
import SendForm from "./SendForm/SendForm";
import SubscriptionsHookWrapper from "./ChatBody/components/SubscriptionsHookWrapper";
import { PusherPresence } from "@/context/outerContexts/PusherProvider";
import ChatHeader from "./ChatHeader/ChatHeader";
import "./innercontextswrapper.scss";
import { TPrisma_User } from "@/lib/prisma/prisma";
import { useEffect } from "react";
import apiAuth_authenticate from "@/lib/apiAuthMethods/apiAuth_authenticate";

export default function InnerContextsWrapper({
  userId,
  pusher,
}: {
  userId: TPrisma_User;
  pusher: PusherPresence;
}) {
  // console.log("------------Chat rerender-------------");

  // authenticating with back-end to avoid 401 errors
  useEffect(() => {
    apiAuth_authenticate({
      user_id: userId.user_id,
      user_admin: userId.user_admin,
    });
  }, []);

  return (
    <div className="chat">
      <SubscriptionsHookWrapper pusher={pusher} userId={userId} />
      <ChatRooms
        user_name={userId.user_name}
        user_id={userId.user_id}
        user_admin={userId.user_admin}
      />
      <div className="chat__wrapper">
        <ChatHeader
          user_name={userId.user_name}
          user_admin={userId.user_admin}
        />
        <ChatBody userId={userId} />
        <SendForm userId={userId} />
      </div>
    </div>
  );
}
