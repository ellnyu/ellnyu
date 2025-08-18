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
	"github.com/ellnyu/ellnyu/backend/internal/server"
	"github.com/joho/godotenv"
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
		if err := db.Connect(cfg); err != nil {
			log.Fatalf("Failed to connect to DB: %v", err)
		}
		defer db.Pool.Close()
		if err := db.InitDB(); err != nil {
			log.Fatalf("DB initialization failed: %v", err)
		}
		log.Println("Connected to DB successfully")
	}

	// Router
	router := server.NewRouter(cfg)

	// Server
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Run
	go func() {
		log.Printf("Server running on port %s...", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Graceful shutdown
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

