package instagram

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/db"
)

func insertStory(story Story) error {
	query := `
	INSERT INTO ellnyu.stories (id, media_type, media_url, timestamp, permalink, username, caption)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (id) DO NOTHING
	`

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := db.Pool.Exec(ctx, query,
		story.ID,
		story.MediaType,
		story.MediaURL,
		story.Timestamp,
		story.Permalink,
		story.Username,
		story.Caption,
	)

	if err != nil {
		return fmt.Errorf("failed to insert story: %v", err)
	}
	return nil
}

func PollInstagramStories(cfg config.Config, pool *pgxpool.Pool) {
	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	// Run once immediately
	fetchAndStoreStories(cfg)

	for range ticker.C {
		fetchAndStoreStories(cfg)
	}
}

func fetchAndStoreStories(cfg config.Config) {
	token := cfg.InstagramToken
	userID := cfg.InstagramUserID

	if token == "" || userID == "" {
		log.Println("⚠️ Missing Instagram API credentials, skipping fetch")
		return
	}

	url := fmt.Sprintf(
		"https://graph.instagram.com/%s/stories?fields=id,media_type,media_url,timestamp,permalink,username,caption&access_token=%s",
		userID,
		token,
	)

	resp, err := http.Get(url)
	if err != nil {
		log.Println("Error calling Instagram API:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Instagram API returned %d\n", resp.StatusCode)
		return
	}

	var result struct {
		Data []Story `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Println("Error decoding Instagram response:", err)
		return
	}

	for _, s := range result.Data {
		if err := insertStory(s); err != nil {
			log.Println("DB insert failed for story:", s.ID, err)
		}
	}

	log.Printf("Inserted/updated %d stories\n", len(result.Data))
}
