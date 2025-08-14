package instagram

import (
	"encoding/json"
	"net/http"

	"github.com/ellnyu/ellnyu/backend/config"
)

// MeHandler returns account info for the authenticated Instagram user
func MeHandler(w http.ResponseWriter, r *http.Request, cfg config.Config) {
	data, err := GetInstagramUser(cfg.InstagramToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}
