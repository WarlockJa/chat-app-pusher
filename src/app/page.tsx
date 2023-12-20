import Chat from "./components/Chat";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Chat storage_uuid={process.env.NEXT_PUBLIC_LOCAL_STORAGE_UUID!} />
    </main>
  );
}
