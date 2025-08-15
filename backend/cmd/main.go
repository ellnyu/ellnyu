package main

import (
	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/instagram"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
)

func main() {
	// Load environment variables from .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load config
	cfg := config.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Pass config into handler via closure
	mux.HandleFunc("/instagram/me", instagram.MeHandler(cfg))
	mux.HandleFunc("/instagram/stories", instagram.StoriesHandler(cfg))
	mux.HandleFunc("/instagram/posts", instagram.PostsHandler(cfg))

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
	})
	log.Printf("Server running on port %s...", port)
	log.Fatal(http.ListenAndServe(":8080", c.Handler(mux)))
}
