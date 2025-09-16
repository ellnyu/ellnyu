package instagram

import "time"

type Story struct {
	ID        string `json:"id"`
	MediaType string `json:"media_type"`
	MediaURL  string `json:"media_url"`
	Timestamp string `json:"timestamp"`
	Permalink string `json:"permalink,omitempty"`
	Username  string `json:"username,omitempty"`
	Caption   string `json:"caption,omitempty"`
	LocalPath string `json:"local_path,omitempty"`
}

type DBStory struct {
	ID        string    `json:"id"`
	MediaType string    `json:"media_type"`
	MediaURL  string    `json:"media_url"`
	Timestamp time.Time `json:"timestamp"`
	Permalink string    `json:"permalink,omitempty"`
	Username  string    `json:"username,omitempty"`
	Caption   string    `json:"caption,omitempty"`
	LocalPath string    `json:"local_path,omitempty"`
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
