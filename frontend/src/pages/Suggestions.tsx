// SuggestionPage.tsx
import React, { useState } from "react";

interface Suggestion {
  id: number;
  text: string;
}

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [input, setInput] = useState("");

  // Temporarily handle add suggestion on frontend
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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hva skal jeg jobbe med på siden først?</h1>

      <div className="mb-6">
        <textarea
          className="w-full p-2 border rounded mb-2"
          placeholder="Type your suggestion..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddSuggestion}
        >
          Give it to meee
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Forslag</h2>
        {suggestions.length === 0 ? (
          <p className="text-gray-500">Ingen som bryr seg om siden min enda:/</p>
        ) : (
          <ul className="space-y-2">
            {suggestions.map((s) => (
              <li
                key={s.id}
                className="p-2 border rounded bg-gray-50 hover:bg-gray-100"
              >
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
