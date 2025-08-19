package auth

import (
	"encoding/json"
	"github.com/ellnyu/ellnyu/backend/config"
	"log"
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
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if creds.Username != cfg.Username || creds.Password != cfg.Password {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	token, err := GenerateToken(creds.Username, true)
	if err != nil {
		log.Println("error generating token:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
