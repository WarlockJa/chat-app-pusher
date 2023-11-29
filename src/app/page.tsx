import Chat from "./components/Chat";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Chat />
    </main>
  );
}
