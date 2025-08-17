'use client';
import React, { useState } from "react";
import styles from "./page.module.scss";

interface Suggestion {
  id: number;
  text: string;
}

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [input, setInput] = useState("");

  const handleAddSuggestion = () => {
    if (!input.trim()) return;

    const newSuggestion: Suggestion = {
      id: suggestions.length + 1,
      text: input,
    };

    setSuggestions([...suggestions, newSuggestion]);
    setInput("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hva skal jeg jobbe med på siden først?</h1>

      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          placeholder="Type your suggestion..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
        <button className={styles.button} onClick={handleAddSuggestion}>
          Give it to meee
        </button>
      </div>

      <div>
        <h2 className={styles.suggestionsTitle}>Forslag</h2>
        {suggestions.length === 0 ? (
          <p className={styles.noSuggestions}>Ingen som bryr seg om siden min enda:/</p>
        ) : (
          <ul className={styles.suggestionsList}>
            {suggestions.map((s) => (
              <li key={s.id} className={styles.suggestionItem}>
                {s.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Suggestions;

