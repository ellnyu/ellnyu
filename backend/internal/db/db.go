package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect(cfg config.Config) error {
	var err error
	Pool, err = pgxpool.New(context.Background(), cfg.DBUrl)
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

func InitDB() error {
	query := `
	CREATE TABLE IF NOT EXISTS ellnyu.messages (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		message TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW()
	);

    CREATE TABLE IF NOT EXISTS ellnyu.travels (
        id SERIAL PRIMARY KEY,
        location TEXT NOT NULL,
        country TEXT NOT NULL,
        latitude DECIMAL(9,7),
        longitude DECIMAL(9,6),
        travel_date TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ellnyu.books (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        rating INTEGER,
        review TEXT,
        read_date TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ellnyu.suggestions (
        id SERIAL PRIMARY KEY,
        suggestion TEXT NOT NULL,
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

func InsertMessage(name string, message string) error {
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

func InsertSuggestion(name string, message string) error {
	query := `
	INSERT INTO ellnyu.suggestions (suggestion)
	VALUES ($1)
	`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := Pool.Exec(ctx, query, name, message)
	if err != nil {
		return fmt.Errorf("failed to insert review: %v", err)
	}

	return nil
}
