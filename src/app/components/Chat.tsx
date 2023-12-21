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
import {
  IUserId,
  activeRoomAtom,
  pusherAtom,
  userIdAtom,
} from "@/lib/localState";
import TestElement from "./TestElement";
import { PresenceChannel } from "pusher-js";

interface IChatProps extends IUserId {
  storage_uuid: string;
}

export default function Chat({
  user_id,
  user_name,
  user_admin,
  storage_uuid,
}: IChatProps) {
  // jotai store data
  const [userId, setUserId] = useAtom(userIdAtom);
  const [, setActiveRoom] = useAtom(activeRoomAtom);
  const [pusher, setPusher] = useAtom(pusherAtom);

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
      // creating userChannel connection
      const tempChannel = pusherClient(user_id);
      setPusher(tempChannel);
      // subscribing to presence-system
      // tempChannel.subscribe("presence-system") as PresenceChannel;
    } else {
      // checking localStorage for saved credentials
      const localStorageUser: IUserLocalStorageData =
        readLocalStorage(storage_uuid);

      // no data found
      // TODO process channel creation on no user data
      // if (!localStorageUser) return;
      // TEST
      if (!localStorageUser) {
        console.log("TEST");
        setUserId({ user_id: "Mike", user_name: "Mike" });
        setActiveRoom(`presence-WJ`);
        setPusher(pusherClient("Mike"));
        return;
      }

      // saving data from localStorage to state
      // TODO replace
      // setUserId(localStorageUser);
      localStorageUser.user_name === "WJ"
        ? setUserId({ ...localStorageUser, user_admin: true })
        : setUserId(localStorageUser);
      setActiveRoom(`presence-${localStorageUser.user_id}`);
      // creating userChannel connection
      const tempChannel = pusherClient(localStorageUser.user_id);
      setPusher(tempChannel);
      // subscribing to presence-system
      // tempChannel.subscribe("presence-system") as PresenceChannel;
    }

    return () => {
      if (!pusher) return;
      console.log("Cleanup");
      pusher.disconnect();
      // pusherClient(userId.user_id).disconnect();
    };
  }, []);

  return <TestElement />;

  return !userId?.user_id ? (
    <NoUserPlug storage_uuid={storage_uuid} />
  ) : (
    <div className="chat">
      <ChatRooms />
      {/* <div className="chat__wrapper">
        <ChatBody />
        <SendForm />
      </div> */}
    </div>
  );
}
