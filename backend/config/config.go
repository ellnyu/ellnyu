package config

import (
	"github.com/ellnyu/ellnyu/backend/internal/storage"
	"log"
	"os"
	"strconv"
)

type Config struct {
	InstagramToken      string
	InstagramUserID     string
	InstagramUserNumber int
	Environment         string
	Username            string
	Password            string
	DBUrl               string
	PositionStackURL    string
	PositionStackKey    string
	R2Client            *storage.R2
}

func Load() Config {
	token := os.Getenv("INSTAGRAM_TOKEN")
	userID := os.Getenv("INSTAGRAM_USER_ID")
	userNumber, err := strconv.Atoi(os.Getenv("INSTAGRAM_USER_NUMBER"))
	if err != nil {
		log.Fatalf("Failed to convert str to int for instagram number")
	}
	env := os.Getenv("ENV")
	username := os.Getenv("USERNAME")
	password := os.Getenv("PASSWORD")
	dbURL := os.Getenv("DATABASE_URL")
	positionstackURL := os.Getenv("POSITIONSTACK_API_URL")
	positionstackKey := os.Getenv("POSITIONSTACK_API_KEY")

	r2AccessKey := os.Getenv("R2_ACCESS_KEY")
	r2AccessID := os.Getenv("R2_ACCESS_ID")
	r2Endpoint := os.Getenv("S3_API")
	r2BucketName := os.Getenv("BUCKET_NAME")

	if dbURL == "" {
		log.Fatal("DATABASE_URL not set")
	}

	if token == "" || userID == "" {
		log.Fatal("Missing Instagram API credentials")
	}

	if positionstackKey == "" {
		log.Fatal("Missing PositionStack API credentials")
	}

	r2Client, err := storage.NewR2(
		r2Endpoint,
		r2AccessID,
		r2AccessKey,
		r2BucketName,
	)

	return Config{
		InstagramToken:      token,
		InstagramUserID:     userID,
		InstagramUserNumber: userNumber,
		Environment:         env,
		Username:            username,
		Password:            password,
		DBUrl:               dbURL,
		PositionStackURL:    positionstackURL,
		PositionStackKey:    positionstackKey,
		R2Client:            r2Client,
	}
}
