import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/utils/api";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newReview: { name: string; message: string }) =>
      apiPost("/messages", newReview),
    onSuccess: () => {
      // invalidate cached reviews → triggers refetch
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
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
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? "Sender..." : "Send"}
      </button>
    </form>
  );
}

