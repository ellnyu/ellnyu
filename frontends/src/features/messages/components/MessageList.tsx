import { useEffect, useState } from "react";
import { apiGet } from "@/utils/api";

type Message = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

export default function MessagesList({ reviews }: { reviews: Message[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await apiGet<Message[]>("/messages");
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) return <p>Laster inn dumme meldinger...</p>;

  return (
    <div>
      <h2>Jeg fortjener roasts nå:</h2>
      {reviews.length === 0 ? (
        <p>tørr du ikke skrive eller?</p>
      ) : (
    <ul>
      {reviews.map((r) => (
        <li key={r.id}>
          <strong>{r.name}:</strong> {r.message} <em>({new Date(r.created_at).toLocaleString()})</em>
        </li>
      ))}
    </ul>
      )}
    </div>
  );
}

