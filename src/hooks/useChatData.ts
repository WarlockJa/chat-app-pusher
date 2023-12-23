import { userIdAtom } from "@/lib/localState";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import type { Message } from "@prisma/client";
import usePusherConnection from "./usePusherConnection";

interface IChatData {
  activeRoom: string;
  rooms: {
    roomId: string;
    messages: Message[];
  }[];
}

export default function useChatData() {
  // user data from state
  const [userId] = useAtom(userIdAtom);
  // local chat data
  const [chatData, setChatData] = useState<IChatData>();
  // getting pusher instance
  const {pusher} = usePusherConnection()

  useEffect(() => {
    // discarding chat data if user_id no longer present e.g. user logout
    if(!userId.user_id) {
      setChatData(undefined)
    }

    const systemChannel = pusher.

  },[userId.user_id])

  return { chatData };
}
