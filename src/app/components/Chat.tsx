"use client";
import React, { useEffect } from "react";
import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";
import { pusherClient } from "@/lib/pusher";
import { useAtom } from "jotai";
import { IUserLocalStorageData, readLocalStorage } from "@/util/localStorageRW";
import NoUserPlug from "./NoUserPlug";
import { IUserId, activeRoomAtom, userIdAtom } from "@/lib/localState";

interface IChatProps extends IUserId {
  storage_uuid: string;
}

export default function Chat({
  user_id,
  user_name,
  user_admin,
  storage_uuid = process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID!,
}: IChatProps) {
  // jotai store data
  const [userId, setUserId] = useAtom(userIdAtom);
  const [, setActiveRoom] = useAtom(activeRoomAtom);

  // TEST
  console.log("Chat rerender", userId);

  useEffect(() => {
    if (user_id) {
      // saving to state passed user Id Token
      setUserId({
        user_id,
        user_name: user_name ? user_name : user_id,
        user_admin,
      });
      setActiveRoom(`presence-${user_id}`);
    } else {
      // checking localStorage for saved credentials
      const localStorageUser: IUserLocalStorageData =
        readLocalStorage(storage_uuid);

      // no data found
      if (!localStorageUser) return;

      // saving data from localStorage to state
      // TODO replace
      // setUserId(localStorageUser);
      localStorageUser.user_name === "WJ"
        ? setUserId({ ...localStorageUser, user_admin: true })
        : setUserId(localStorageUser);
      setActiveRoom(`presence-${localStorageUser.user_id}`);
    }

    return () => {
      if (!userId?.user_id) return;
      console.log("Cleanup");
      pusherClient(userId.user_id).disconnect();
    };
  }, []);

  return !userId?.user_id ? (
    <NoUserPlug storage_uuid={storage_uuid} />
  ) : (
    <div className="chat">
      {userId.user_admin ? <ChatRooms /> : null}
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm />
      </div>
    </div>
  );
}
