package instagram

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/db"
	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func MeHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := GetInstagramUser(cfg.InstagramToken)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func StoriesHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		rows, err := db.Pool.Query(ctx, `
            SELECT id, media_type, media_url, timestamp, permalink, username, caption, local_path
            FROM ellnyu.stories
            ORDER BY timestamp DESC
        `)
		if err != nil {
			http.Error(w, "failed to fetch stories", http.StatusInternalServerError)
			log.Println("DB query error:", err)
			return
		}
		defer rows.Close()

		var stories []DBStory
		for rows.Next() {
			var s DBStory
			if err := rows.Scan(&s.ID, &s.MediaType, &s.MediaURL, &s.Timestamp, &s.Permalink, &s.Username, &s.Caption, &s.LocalPath); err != nil {
				log.Println("Scan error:", err)
				http.Error(w, "failed to scan story", http.StatusInternalServerError)
				return
			}
			stories = append(stories, s)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(stories)
	}
}
