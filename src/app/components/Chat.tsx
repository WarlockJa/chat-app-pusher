"use client";
import React, { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import SendForm from "./SendForm";
import "./chat.scss";
import ChatRooms from "./ChatRooms";

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

export default function Chat() {
  // user_id as a cookie for testing purposes
  // in production replace with authenticated user data
  const [userId, setUserId] = useState<string | null>("");
  useEffect(() => {
    setUserId(readCookie("user_id"));
  }, []);
  return (
    <div className="chat">
      <ChatRooms userId={userId} />
      <div className="chat__wrapper">
        <ChatBody userId={userId} />
        <SendForm userId={userId} setUserId={setUserId} />
      </div>
    </div>
  );
}
