package instagram

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/db"
)

func insertStory(story Story) error {
	t, err := time.Parse("2006-01-02T15:04:05-0700", story.Timestamp)
	if err != nil {
		return fmt.Errorf("failed to parse timestamp %q: %w", story.Timestamp, err)
	}
	query := `
	INSERT INTO ellnyu.stories (id, media_type, media_url, timestamp, permalink, username, caption, local_path)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	ON CONFLICT (id) DO NOTHING
	`
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = db.Pool.Exec(ctx, query,
		story.ID,
		story.MediaType,
		story.MediaURL,
		t,
		story.Permalink,
		story.Username,
		story.Caption,
		story.LocalPath,
	)

	if err != nil {
		return fmt.Errorf("failed to insert story: %v", err)
	}
	return nil
}

func PollInstagramStories(cfg config.Config, stop <-chan struct{}) {
	ticker := time.NewTicker(60 * time.Minute)

	log.Println("calling Instagram API for stories")
	defer ticker.Stop()

	defer ticker.Stop()

	// Run once immediately

	for {
		select {
		case <-ticker.C:
			fetchAndStoreStories(cfg)

		case <-stop:
			log.Println("Stopping Instagram stories poller")
			return
		}
	}
}

func fetchAndStoreStories(cfg config.Config) {
	token := cfg.InstagramToken
	userNumber := cfg.InstagramUserNumber

	if token == "" {
		log.Println("⚠️ Missing Instagram API credentials, skipping fetch")
		return
	}

	url := fmt.Sprintf(
		"https://graph.instagram.com/%d/stories?fields=id,media_type,media_url,timestamp,permalink,username,caption&access_token=%s",
		userNumber,
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
		url, err := cfg.R2Client.UploadStoryMedia(context.Background(), s.ID, s.MediaType, s.MediaURL)
		if err != nil {
			log.Println("Failed to upload story to R2", err)
			continue
		}

		s.LocalPath = url

		if err := insertStory(s); err != nil {
			log.Println("DB insert failed for story:", s.ID, err)
		}
	}

	log.Printf("Inserted/updated %d stories\n", len(result.Data))
}
