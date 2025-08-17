package suggestions

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/internal/db"
)

type Suggestion struct {
	ID         int       `json:"id"`
	Suggestion string    `json:"suggestion"`
	CreatedAt  time.Time `json:"created_at"`
}

func CreateSuggestionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("CreateSuggestionHandler: method not allowed", r.Method)
		return
	}

	var input struct {
		Suggestion string `json:"suggestion"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("CreateSuggestionHandler: failed to decode body:", err)
		return
	}

	log.Println("CreateSuggestionHandler: received suggestion:", input.Suggestion)

	// Insert into DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var suggestion Suggestion
	query := `
		INSERT INTO ellnyu.suggestions (suggestion)
		VALUES ($1)
		RETURNING id, suggestion, created_at
	`
	err := db.Pool.QueryRow(ctx, query, input.Suggestion).
		Scan(&suggestion.ID, &suggestion.Suggestion, &suggestion.CreatedAt)
	if err != nil {
		http.Error(w, "failed to insert review: "+err.Error(), http.StatusInternalServerError)
		log.Println("CreateSuggestionHandler: DB insert error:", err)
		return
	}

	log.Println("CreateSuggestionHandler: inserted suggestion with ID:", suggestion.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(suggestion)
}

func GetSuggestionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("GetSuggestionsHandler: method not allowed", r.Method)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT id, suggestion, created_at
		FROM ellnyu.suggestions
		ORDER BY created_at DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch suggestions: "+err.Error(), http.StatusInternalServerError)
		log.Println("GetSuggestionsHandler: DB query error:", err)
		return
	}
	defer rows.Close()

	var suggestions []Suggestion
	for rows.Next() {
		var r Suggestion
		if err := rows.Scan(&r.ID, &r.Suggestion, &r.CreatedAt); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			log.Println("GetSuggestionsHandler: row scan error:", err)
			return
		}
		suggestions = append(suggestions, r)
	}

	log.Printf("GetSuggestionsHandler: returning %d suggestions\n", len(suggestions))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(suggestions)
}

