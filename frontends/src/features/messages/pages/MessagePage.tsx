import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";

export default function MessagePage() {
  const { data: reviews = [], isLoading, error, refetch } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => apiGet("/messages"),
  });

  if (isLoading) return <p>Loading reviews...</p>;
  if (error) return <p>Failed to load reviews 😢</p>;

  return (
    <main>
      <h1>Meldinger</h1>
      <MessageForm />
      <MessageList />
    </main>
  );
}
