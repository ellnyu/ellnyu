package server

import (
	"net/http"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/auth"
	"github.com/ellnyu/ellnyu/backend/internal/blog"
	"github.com/ellnyu/ellnyu/backend/internal/books"
	"github.com/ellnyu/ellnyu/backend/internal/instagram"
	"github.com/ellnyu/ellnyu/backend/internal/messages"
	"github.com/ellnyu/ellnyu/backend/internal/recipes"
	"github.com/ellnyu/ellnyu/backend/internal/suggestions"
	"github.com/ellnyu/ellnyu/backend/internal/travels"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewRouter(cfg config.Config) http.Handler {
	r := mux.NewRouter()

	// Auth
	r.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.LoginHandler(w, r, cfg)
	})

	// Blog routes
	r.HandleFunc("/blog", blog.GetBlogPostsHandler).Methods(http.MethodGet)
	r.HandleFunc("/blog", auth.RequireAuth(blog.CreateBlogPostHandler)).Methods(http.MethodPost)
	r.HandleFunc("/blog/{id:[0-9]+}", blog.GetBlogPostHandler).Methods(http.MethodGet)

	// Instagram routes
	r.HandleFunc("/instagram/me", instagram.MeHandler(cfg))
	r.HandleFunc("/instagram/stories", instagram.StoriesHandler())
	r.HandleFunc("/instagram/posts", instagram.PostsHandler(cfg))

	// Travels
	r.HandleFunc("/travels", travels.GetTravelHandler).Methods(http.MethodGet)
	r.HandleFunc("/travels", auth.RequireAuth(travels.CreateTravelHandler(cfg))).Methods(http.MethodPost)

	// Messages
	r.HandleFunc("/messages", messages.GetMessagesHandler).Methods(http.MethodGet)
	r.HandleFunc("/messages", messages.CreateMessageHandler).Methods(http.MethodPost)

	// Suggestions
	r.HandleFunc("/suggestions", suggestions.GetSuggestionsHandler).Methods(http.MethodGet)
	r.HandleFunc("/suggestions", suggestions.CreateSuggestionHandler).Methods(http.MethodPost)

	// Books
	r.HandleFunc("/books", books.GetBooksHandler).Methods(http.MethodGet)
	r.HandleFunc("/books", auth.RequireAuth(books.CreateBookHandler)).Methods(http.MethodPost)
	r.HandleFunc("/books/delete", auth.RequireAuth(books.DeleteBookHandler))

	// Recipes
	r.HandleFunc("/recipes", recipes.GetRecipesHandler).Methods(http.MethodGet)
	r.HandleFunc("/recipes", auth.RequireAuth(recipes.CreateRecipeHandler)).Methods(http.MethodPost)
	r.HandleFunc("/recipes/rating", recipes.InsertRatingHandler).Methods(http.MethodPost)
	r.HandleFunc("/recipes/delete", auth.RequireAuth(recipes.DeleteRecipeHandler))

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://ellnyu-frontend.onrender.com",
			"https://www.ellnyu.com",
		},
		AllowedMethods: []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowedHeaders: []string{"*"},
	})

	return c.Handler(r)
}
