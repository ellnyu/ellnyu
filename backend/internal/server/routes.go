package server

import (
	"log"
	"net/http"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/auth"
	"github.com/ellnyu/ellnyu/backend/internal/books"
	"github.com/ellnyu/ellnyu/backend/internal/instagram"
	"github.com/ellnyu/ellnyu/backend/internal/messages"
	"github.com/ellnyu/ellnyu/backend/internal/suggestions"
	"github.com/ellnyu/ellnyu/backend/internal/travels"
	"github.com/rs/cors"
)

func NewRouter(cfg config.Config) http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.LoginHandler(w, r, cfg)
	})
	mux.HandleFunc("/instagram/me", instagram.MeHandler(cfg))
	mux.HandleFunc("/instagram/stories", instagram.StoriesHandler(cfg))
	mux.HandleFunc("/instagram/posts", instagram.PostsHandler(cfg))

	mux.HandleFunc("/travels", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			travels.GetTravelHandler(w, r)
		} else if r.Method == http.MethodPost {
			log.Printf("We here")
			auth.RequireAuth(travels.CreateTravelHandler(cfg))(w, r)
		} else {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/messages", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			messages.CreateMessageHandler(w, r)
		case http.MethodGet:
			messages.GetMessagesHandler(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/suggestions", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			suggestions.CreateSuggestionHandler(w, r)
		case http.MethodGet:
			suggestions.GetSuggestionsHandler(w, r)
		default:
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/books", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			books.GetBooksHandler(w, r)
		} else if r.Method == http.MethodPost {
			log.Printf("we are here")
			auth.RequireAuth(books.CreateBookHandler)(w, r)
		} else {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	mux.HandleFunc("/books/delete", auth.RequireAuth(books.DeleteBookHandler))

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://ellnyu-frontend.onrender.com",
			"https://www.ellnyu.com",
		},
		AllowedMethods: []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowedHeaders: []string{"*"},
	})

	return c.Handler(mux)
}
