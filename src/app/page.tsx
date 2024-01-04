"use client";
import { PusherConnectionProvider } from "@/context/PusherProvider";
import Chat from "./components/Chat";
import styles from "./page.module.css";
import { UserIdProvider } from "@/context/UserIdProvider";

export default function Home() {
  return (
    <main className={styles.main}>
      <UserIdProvider>
        <PusherConnectionProvider>
          <Chat storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID} />
        </PusherConnectionProvider>
      </UserIdProvider>
    </main>
  );
}
