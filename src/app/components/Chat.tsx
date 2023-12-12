"use client";
import React, { useEffect } from "react";
import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";
import { pusherClient } from "@/lib/pusher";
import { atom, useAtom } from "jotai";

function readCookie(name: string) {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return null; // Cookie not found
}

export interface IChatData {
  roomId: string;
  messages: {
    author: string;
    text: string;
  }[];
}

export const userIdAtom = atom<string | null>(null); // replace with IdToken data in production
export const activeRoomAtom = atom("");
export const roomsListAtom = atom<string[]>([]);
export const chatDataAtom = atom<IChatData[]>([]);

export default function Chat() {
  const [, setUserId] = useAtom(userIdAtom);
  const [, setActiveRoom] = useAtom(activeRoomAtom);

  useEffect(() => {
    const cookieUser = readCookie("user_id");
    setUserId(cookieUser);
    setActiveRoom(`presence-${cookieUser}`);

    return () => {
      console.log("Cleanup");
      pusherClient.disconnect();
    };
  }, []);

  return (
    <div className="chat">
      <ChatRooms />
      <div className="chat__wrapper">
        <ChatBody />
        <SendForm />
      </div>
    </div>
  );
}
