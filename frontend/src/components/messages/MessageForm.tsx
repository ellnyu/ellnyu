"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/utils/api";

export default function MessagesForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newMessage: { name: string; message: string }) =>
      apiPost("/messages", newMessage),
    onSuccess: () => {
      // Rerun the "messages" query to refresh the list
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Navn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Melding du vil sende til din kjære"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? "Sender..." : "Send"}
</button>

    </form>
  );
}

