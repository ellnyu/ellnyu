import MessagesForm from "@/components/messages/MessageForm";
import MessagesList from "@/components/messages/MessageList";

export default function MessagesPage() {
  return (
    <main>
      <h1>Meldinger</h1>
      <MessagesForm />
      <MessagesList />
    </main>
  );
}

