"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/utils/api";
import styles from "./MessageForm.module.scss";

export default function MessagesForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newMessage: { name: string; message: string }) =>
      apiPost("/messages", newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      setName("");
      setMessage("");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ name, message });
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Send en melding</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
        <textarea
          placeholder="Melding du vil sende til meg (om du tørr?!) "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className={styles.textarea}
        />
        <button
          type="submit"
          disabled={mutation.isPending}
          className="secondary"
        >
          {mutation.isPending ? "Sender..." : "Send"}
        </button>
      </form>
    </div>
  );
}

