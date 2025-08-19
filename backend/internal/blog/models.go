package blog

import "time"

type BlogPostInput struct {
	Title    string   `json:"title"`
	Content  string   `json:"content"`
	Tags     []string `json:"tags"`
	Category string   `json:"category"`
	Images   []struct {
		Url      string `json:"url"`
		Position int    `json:"position"`
	} `json:"images"`
}

type BlogPostPreview struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Excerpt   string    `json:"excerpt"`
	CreatedAt time.Time `json:"createdAt"`
	Tags      []string  `json:"tags"`
	Category  string    `json:"category"`
}

type BlogPost struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	Tags      []string  `json:"tags"`
	Category  string    `json:"categories"`
	Images    []string  `json:"images"`
}
