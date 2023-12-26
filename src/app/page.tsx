"use client";
import { PusherConnectionProvider } from "@/context/PusherProvider";
import Chat from "./components/Chat";
import styles from "./page.module.css";
import { ChatDataProvider } from "@/context/ChatDataProvider";
import { UserIdProvider } from "@/context/UserIdProvider";
import { ChatRoomsProvider } from "@/context/ChatRoomsProvider";

export default function Home() {
  return (
    <main className={styles.main}>
      <UserIdProvider>
        <PusherConnectionProvider>
          <ChatRoomsProvider>
            <ChatDataProvider>
              <Chat storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID} />
            </ChatDataProvider>
          </ChatRoomsProvider>
        </PusherConnectionProvider>
      </UserIdProvider>
    </main>
  );
}
