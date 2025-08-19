package config

import (
	"log"
	"os"
)

type Config struct {
	InstagramToken   string
	InstagramUserID  string
	Environment      string
	Username         string
	Password         string
	DBUrl            string
	PositionStackURL string
	PositionStackKey string
}

func Load() Config {
	token := os.Getenv("INSTAGRAM_TOKEN")
	userID := os.Getenv("INSTAGRAM_USER_ID")
	env := os.Getenv("ENV")
	username := os.Getenv("USERNAME")
	password := os.Getenv("PASSWORD")
	dbURL := os.Getenv("DATABASE_URL")
	positionstackURL := os.Getenv("POSITIONSTACK_API_URL")
	positionstackKey := os.Getenv("POSITIONSTACK_API_KEY")

	if dbURL == "" {
		log.Fatal("DATABASE_URL not set")
	}

	if token == "" || userID == "" {
		log.Fatal("Missing Instagram API credentials")
	}

	if positionstackKey == "" {
		log.Fatal("Missing PositionStack API credentials")
	}

	return Config{
		InstagramToken:   token,
		InstagramUserID:  userID,
		Environment:      env,
		Username:         username,
		Password:         password,
		DBUrl:            dbURL,
		PositionStackURL: positionstackURL,
		PositionStackKey: positionstackKey,
	}
}
