package instagram

type Story struct {
	ID       string `json:"id"`
	MediaURL string `json:"media_url"`
	Caption  string `json:"caption,omitempty"`
}

type StoriesResponse struct {
	Data []Story `json:"data"`
}

type Post struct {
	ID        string `json:"id"`
	Caption   string `json:"caption"`
	MediaType string `json:"media_type"`
	MediaURL  string `json:"media_url"`
	Timestamp string `json:"timestamp"`
}
