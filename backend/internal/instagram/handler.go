package instagram

import (
	"encoding/json"
	"net/http"

	"github.com/ellnyu/ellnyu/backend/config"
)

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
