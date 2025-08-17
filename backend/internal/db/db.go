package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

// Connect initializes the database connection
func Connect() error {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return fmt.Errorf("DATABASE_URL not set")
	}

	var err error
	Pool, err = pgxpool.New(context.Background(), dbURL)
	if err != nil {
		return fmt.Errorf("unable to connect to DB: %v", err)
	}

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := Pool.Ping(ctx); err != nil {
		return fmt.Errorf("unable to ping DB: %v", err)
	}

	log.Println("Connected to DB")
	return nil
}

// InitDB creates tables if they don't exist
func InitDB() error {
	query := `
	CREATE TABLE IF NOT EXISTS ellnyu.messages (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW()
	);
	`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := Pool.Exec(ctx, query)
	if err != nil {
		return fmt.Errorf("failed to initialize DB: %v", err)
	}

	log.Println("DB initialized successfully")
	return nil
}

// InsertReview inserts a new review into the reviews table
func InsertReview(name string, message string) error {
	query := `
	INSERT INTO ellnyu.messages (name, message)
	VALUES ($1, $2)
	`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := Pool.Exec(ctx, query, name, message)
	if err != nil {
		return fmt.Errorf("failed to insert review: %v", err)
	}

	return nil
}

