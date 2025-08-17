"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api";

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

  if (isLoading) return <p>Laster inn meldinger...</p>;

  return (
    <div>
      <h2>Jeg fortjener roasts nå:</h2>
      {messages.length === 0 ? (
        <p>Tørr du ikke skrive eller?</p>
      ) : (
        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              <strong>{m.name}:</strong> {m.message}{" "}
              <em>({new Date(m.created_at).toLocaleString()})</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

