import { useChatRoomsContext } from "@/context/ChatRoomsProvider";
import useSubscriptions from "@/hooks/useSubscriptions";
import { useEffect } from "react";

// TEST
export default function Initializer({ userId }: { userId: IUserId }) {
  const { setActiveRoom, setRoomsList } = useChatRoomsContext();

  // console.log("Initializer rerender");

  useEffect(() => {
    console.log("Initializer useEffect ", userId.user_id);

    setRoomsList([
      { roomName: "presence-system", users: [] },
      {
        roomName: `presence-${userId.user_id}`,
        users: [],
      },
    ]);
    setActiveRoom(`presence-${userId.user_id}`);
  }, []);

  useSubscriptions();
  return null;
}
