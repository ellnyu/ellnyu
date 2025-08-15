package instagram

import (
	"fmt"
	"net/http"
)

func InstagramCallbackHandler(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "No code in request", http.StatusBadRequest)
		return
	}

	// Exchange the code for a short-lived access token here
	fmt.Fprintf(w, "Code received: %s", code)
}
