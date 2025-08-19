package books

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/internal/db"
)

type Book struct {
	ID       int       `json:"id"`
	Title    string    `json:"title"`
	Author   string    `json:"author"`
	Rating   int       `json:"rating"`
	Review   string    `json:"review"`
	ReadDate time.Time `json:"read_date"`
}

func CreateBookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("CreateSuggestionHandler: method not allowed", r.Method)
		return
	}

	var input struct {
		Title    string    `json:"title"`
		Author   string    `json:"author"`
		Rating   int       `json:"rating"`
		Review   string    `json:"review"`
		ReadDate time.Time `json:"read_date"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("CreateSuggestionHandler: failed to decode body:", err)
		return
	}

	log.Println("CreateSuggestionHandler: received suggestion:", input.Title)

	// Insert into DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var book Book

	query := `
		INSERT INTO ellnyu.books (title, author, rating, review, read_date)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING ID, title
	`
	err := db.Pool.QueryRow(ctx, query,
		input.Title, input.Author, input.Rating, input.Review, input.ReadDate,
	).Scan(&book.ID, &book.Title)

	if err != nil {
		http.Error(w, "failed to insert review: "+err.Error(), http.StatusInternalServerError)
		log.Println("CreateSuggestionHandler: DB insert error:", err)
		return
	}

	log.Println("CreateBookHandler: inserted suggestion with ID:", book.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

func GetBooksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("GetBooksHandler: method not allowed", r.Method)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT *
		FROM ellnyu.books
		ORDER BY read_date DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch books: "+err.Error(), http.StatusInternalServerError)
		log.Println("GetBooksHandler: DB query error:", err)
		return
	}
	defer rows.Close()

	var books []Book
	for rows.Next() {
		var r Book
		if err := rows.Scan(&r.ID, &r.Title, &r.Author, &r.Rating, &r.Review, &r.ReadDate); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			log.Println("GetSuggestionsHandler: row scan error:", err)
			return
		}
		books = append(books, r)
	}

	log.Printf("GetBooksHandler: returning %d books\n", len(books))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

func DeleteBookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("DeleteBookHandler: method not allowed", r.Method)
		return
	}

	var input struct {
		Title  string `json:"title"`
		Author string `json:"author"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("DeleteBookHandler: failed to decode body:", err)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := db.Pool.Exec(ctx,
		`DELETE FROM ellnyu.books WHERE title=$1 AND author=$2`,
		input.Title, input.Author,
	)
	if err != nil {
		http.Error(w, "failed to delete book: "+err.Error(), http.StatusInternalServerError)
		log.Println("DeleteBookHandler: DB exec error:", err)
		return
	}

	count := res.RowsAffected()
	log.Printf("DeleteBookHandler: deleted %d rows\n", count)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"deleted": count,
	})
}
