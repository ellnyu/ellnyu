"use client";
import styles from "./SuggestionForm.module.scss";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/utils/api";

export default function SuggestionsForm() {
  const [suggestion, setSuggestion] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newSuggestion: { suggestion: string }) =>
      apiPost("/suggestions", newSuggestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      setSuggestion("");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ suggestion });
  }

  return (
    <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}> 
          <textarea
            placeholder="Hva må jeg fikse på? Du kan rante eller være presis, spiller ingen rolle for uansett må jeg fikse på alt"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
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


