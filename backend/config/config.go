package config

import (
	"log"
	"os"
)

type Config struct {
	InstagramToken  string
	InstagramUserID string
}

func Load() Config {
	token := os.Getenv("INSTAGRAM_TOKEN")
	userID := os.Getenv("INSTAGRAM_USER_ID")

	if token == "" || userID == "" {
		log.Fatal("Missing Instagram API credentials")
	}

	return Config{
		InstagramToken:  token,
		InstagramUserID: userID,
	}
}
