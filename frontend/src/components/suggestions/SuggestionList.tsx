"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api";
import styles from "./suggestions.module.scss";

type Suggestion = {
  id: number;
  suggestion: string;
  created_at: string;
};

export default function SuggestionsList() {
  const { data: suggestions = [], isLoading } = useQuery<Suggestion[]>({
    queryKey: ["suggestions"],
    queryFn: () => apiGet("/suggestions"),
  });

  if (isLoading) return <p>Laster inn forslaag...</p>;

  if (!suggestions || suggestions.length === 0) {
    return (
      <div>
        <h1 className={styles.title}>Hva skal jeg jobbe med på siden først?</h1>
        <p>Jeg trenger ideer, eller nei, jeg vil bare ha prioritering for tbh trenger alt å fikses på uansett egt</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Hva skal jeg jobbe med på siden først?</h1>
        <ul>
          {suggestions.map((m) => (
            <li key={m.id}>
              <strong>{m.name}:</strong> {m.suggestion}{" "}
              <em>({new Date(m.created_at).toLocaleString()})</em>
            </li>
          ))}
        </ul>
    </div>
  );
}


