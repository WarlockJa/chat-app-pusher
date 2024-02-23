import ChatTestUsersWrapper from "./components/ChatTestUsersWrapper/ChatTestUsersWrapper";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <ChatTestUsersWrapper />
    </main>
  );
}
