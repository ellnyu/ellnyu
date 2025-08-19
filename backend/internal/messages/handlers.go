package messages

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/internal/db"
)

type Message struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Text      string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
}

func CreateMessageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input struct {
		Name    string `json:"name"`
		Message string `json:"message"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Insert into DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var message Message
	query := `
		INSERT INTO ellnyu.messages (name, message)
		VALUES ($1, $2)
		RETURNING id, name, message, created_at
	`
	err := db.Pool.QueryRow(ctx, query, input.Name, input.Message).
		Scan(&message.ID, &message.Name, &message.Text, &message.CreatedAt)
	if err != nil {
		http.Error(w, "failed to insert message: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(message)
}

func GetMessagesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, message, created_at
		FROM ellnyu.messages
		ORDER BY created_at DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch messages: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var reviews []Message
	for rows.Next() {
		var r Message
		if err := rows.Scan(&r.ID, &r.Name, &r.Text, &r.CreatedAt); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			return
		}
		reviews = append(reviews, r)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}
