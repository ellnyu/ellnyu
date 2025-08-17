package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/db"
	"github.com/ellnyu/ellnyu/backend/internal/instagram"
	messages "github.com/ellnyu/ellnyu/backend/internal/messages"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	cfg := config.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if cfg.Environment != "local" {
		if err := db.Connect(); err != nil {
			log.Fatalf("Failed to connect to DB: %v", err)
		}
		defer db.Pool.Close()
		log.Println("Connected to DB successfully")

		if err := db.InitDB(); err != nil {
			log.Fatalf("DB initialization failed: %v", err)
		}
	}

	// Create HTTP mux
	mux := http.NewServeMux()
	mux.HandleFunc("/instagram/me", instagram.MeHandler(cfg))
	mux.HandleFunc("/instagram/stories", instagram.StoriesHandler(cfg))
	mux.HandleFunc("/instagram/posts", instagram.PostsHandler(cfg))

	mux.HandleFunc("/messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			messages.CreateMessageHandler(w, r)
		} else if r.Method == http.MethodGet {
			messages.GetMessagesHandler(w, r)
		} else {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		}
	})

	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"https://ellnyu-frontend.onrender.com",
			"www.ellnyu.com",
			"https://www.ellnyu.com",
			"http://www.ellnyu.com",
		},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      c.Handler(mux),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Graceful shutdown
	go func() {
		log.Printf("Server running on port %s...", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Wait for interrupt signal
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Println("Server exited cleanly")
}

