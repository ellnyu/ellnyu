"use client";

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
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Hva må jeg fikse på? Du kan rante eller være presis, spiller ingen rolle for uansett må jeg fikse på alt"
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        required
      />
      <button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? "Sender..." : "Send"}
</button>

    </form>
  );
}


