package instagram

type Story struct {
	ID       string `json:"id"`
	MediaURL string `json:"media_url"`
	Caption  string `json:"caption,omitempty"`
}

type StoriesResponse struct {
	Data []Story `json:"data"`
}


