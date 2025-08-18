"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api";
import styles from "./MessageList.module.scss";

type Message = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export default function MessagesList() {
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: () => apiGet("/messages"),
  });

  if (isLoading) return <p className={styles.loading}>Laster inn meldinger...</p>;

  return (
    <div className={styles.container}>
      {messages.length === 0 ? (
        <p className={styles.empty}>Tørr du ikke skrive eller?</p>
      ) : (
        <ul className={styles.list}>
          {messages.map((m) => (
            <li key={m.id} className={styles.card}>
              <div className={styles.header}>
                <strong className={styles.name}>{m.name}</strong>
                <span className={styles.date}>
                  {new Date(m.created_at).toLocaleDateString("no-NO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className={styles.message}>{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

