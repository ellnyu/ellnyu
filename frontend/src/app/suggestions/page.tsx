import SuggestionsForm from "@/components/suggestions/SuggestionForm";
import SuggestionsList from "@/components/suggestions/SuggestionList";

export default function SuggestionsPage() {
  return (
    <main>
      <h1>Forslaag</h1>
      <SuggestionsForm />
      <SuggestionsList />
    </main>
  );
}

