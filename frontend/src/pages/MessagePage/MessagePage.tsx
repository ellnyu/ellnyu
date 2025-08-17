import MessageForm from "../../components/MessageForm/MessageForm";
import MessageList from "../../components/MessageList/MessageList";

export default function MessagePage() {
  return (
    <main>
      <h1>Meldinger</h1>
      <MessageForm />
      <MessageList />
    </main>
  );
}

