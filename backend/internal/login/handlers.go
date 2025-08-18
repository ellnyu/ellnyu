package login

import (
	"encoding/json"
	"github.com/ellnyu/ellnyu/backend/config"
	"net/http"
)

func LoginHandler(w http.ResponseWriter, r *http.Request, cfg config.Config) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	// TODO: load from config / env instead of hardcoding
	if creds.Username == cfg.Username && creds.Password == cfg.Password {
		token := "example-session-token" // in real app generate JWT or random uuid
		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    token,
			HttpOnly: true,
			Path:     "/",
		})
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
		return
	}

	http.Error(w, "unauthorized", http.StatusUnauthorized)
}
