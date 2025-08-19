package instagram

import (
	"io"
	"log"
	"net/http"
)

func ImageHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mediaURL := r.URL.Query().Get("url")
		if mediaURL == "" {
			http.Error(w, "Missing media URL", http.StatusBadRequest)
			return
		}

		resp, err := http.Get(mediaURL)
		if err != nil {
			http.Error(w, "Failed to fetch image", http.StatusBadGateway)
			log.Println("Error fetching image:", err)
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "Failed to fetch image", resp.StatusCode)
			return
		}

		// Stream the image to the frontend
		w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
		_, err = io.Copy(w, resp.Body)
		if err != nil {
			log.Println("Error streaming image:", err)
		}
	}
}

func FetchImage(w http.ResponseWriter, mediaURL string) {
	resp, err := http.Get(mediaURL)
	if err != nil {
		http.Error(w, "Failed to fetch image", http.StatusBadGateway)
		log.Println("Error fetching media:", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Failed to fetch image", resp.StatusCode)
		return
	}

	w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))

	_, err = io.Copy(w, resp.Body)
	if err != nil {
		log.Println("Error streaming media:", err)
	}
}
