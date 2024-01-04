import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import useChatData from "@/hooks/useChatData";
import useSubscriptions from "@/hooks/useSubscriptions";
import { useEffect } from "react";

// TEST
export default function Initializer({ userId, pusher }: IHookProps) {
  const { setActiveRoom, setRoomsList } = useChatRoomsContext();

  // console.log("Initializer rerender");

  // initializing default roomsList
  useEffect(() => {
    console.log("Initializer useEffect ", userId.user_id);

    setRoomsList([
      { roomId: "presence-system", users: [] },
      {
        roomId: `presence-${userId.user_id}`,
        users: [],
      },
    ]);
    setActiveRoom(`presence-${userId.user_id}`);
  }, []);

  // initializing subscriptions processing
  useSubscriptions({ userId, pusher });
  useChatData({ userId, pusher });
  return null;
}
