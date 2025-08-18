import MessagesForm from "@/components/messages/MessageForm";
import MessagesList from "@/components/messages/MessageList";
import styles from "./page.module.scss";

export default function MessagesPage() {
  return (
    <main className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Meldinger</h2>
      <div className={styles.columns}>
        <div className={styles.left}>
          <MessagesForm />
        </div>
        <div className={styles.right}>
          <MessagesList />
        </div>
      </div>
    </main>
  );
}

