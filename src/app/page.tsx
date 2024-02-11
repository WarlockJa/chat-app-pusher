import { PusherConnectionProvider } from "@/context/PusherProvider";
import ChatWrapper from "./components/ChatWrapper";
import styles from "./page.module.css";
import { UserIdProvider } from "@/context/UserIdProvider";

export default function Home() {
  return (
    <main className={styles.main}>
      <UserIdProvider>
        <PusherConnectionProvider>
          <ChatWrapper
            storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID}
            pageLimit={10}
          />
        </PusherConnectionProvider>
      </UserIdProvider>
    </main>
  );
}
