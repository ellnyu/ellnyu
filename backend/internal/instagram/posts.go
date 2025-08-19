package instagram

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/ellnyu/ellnyu/backend/config"
)

func PostsHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := cfg.InstagramToken
		userID := cfg.InstagramUserID

		if token == "" || userID == "" {
			http.Error(w, "Missing Instagram API credentials", http.StatusInternalServerError)
			return
		}

		url := fmt.Sprintf(
			"https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=%s",
			token,
		)

		resp, err := http.Get(url)
		if err != nil {
			http.Error(w, "Failed to contact Instagram API", http.StatusBadGateway)
			log.Println("Error calling Instagram API:", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "Instagram API error", resp.StatusCode)
			return
		}

		var result struct {
			Data []Post `json:"data"`
		}

		if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
			http.Error(w, "Error decoding Instagram response", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(result)
	}
}
