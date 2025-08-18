import SuggestionsForm from "@/components/suggestions/SuggestionForm";
import styles from "./page.module.scss";
import SuggestionsList from "@/components/suggestions/SuggestionList";

export default function SuggestionsPage() {
    return (
    <main className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>Forslaag</h2>
      <div className={styles.columns}>
        <div className={styles.left}>
            <SuggestionsForm />
        </div>
        <div className={styles.right}>
          <SuggestionsList />
        </div>
      </div>
    </main>
  );

}
