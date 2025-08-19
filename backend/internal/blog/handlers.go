package blog

import (
	"context"
	"encoding/json"
	"fmt"
	db "github.com/ellnyu/ellnyu/backend/internal/db"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func GetBlogPostsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("GetBlogPostsHandler: method not allowed", r.Method)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT id, title, content, created_at
		FROM ellnyu.blogposts
		ORDER BY created_at DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch posts: "+err.Error(), http.StatusInternalServerError)
		log.Println("GetBlogPostsHandler: DB query error:", err)
		return
	}
	defer rows.Close()

	var previews []BlogPostPreview
	for rows.Next() {
		var id int
		var title, content string
		var createdAt time.Time

		if err := rows.Scan(&id, &title, &content, &createdAt); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Trim content for preview
		words := strings.Fields(content)
		if len(words) > 50 {
			words = words[:50]
		}
		excerpt := strings.Join(words, " ") + "..."

		// Fetch tags
		tagRows, err := db.Pool.Query(ctx, `
			SELECT t.tag
			FROM ellnyu.tags t
			JOIN ellnyu.blogpost_tags bt ON bt.tag_id = t.id
			WHERE bt.blogpost_id = $1
		`, id)
		if err != nil {
			log.Println("Error fetching tags:", err)
		}
		var tags []string
		for tagRows.Next() {
			var tag string
			if err := tagRows.Scan(&tag); err == nil {
				tags = append(tags, tag)
			}
		}
		tagRows.Close()

		catRows, err := db.Pool.Query(ctx, `
			SELECT c.category
			FROM ellnyu.category c
			JOIN ellnyu.blogpost_categories bc ON bc.category_id = c.id
			WHERE bc.post_id = $1
		`, id)
		if err != nil {
			log.Println("Error fetching categories:", err)
		}
		var category string
		for catRows.Next() {
			var cat string
			if err := catRows.Scan(&cat); err == nil {
				category = cat
			}
		}
		catRows.Close()

		previews = append(previews, BlogPostPreview{
			ID:        id,
			Title:     title,
			Excerpt:   excerpt,
			CreatedAt: createdAt,
			Tags:      tags,
			Category:  category,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(previews)
}

func GetBlogPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	idStr := strings.TrimPrefix(r.URL.Path, "/blog/")
	postID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid post ID", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var post BlogPost
	err = db.Pool.QueryRow(ctx, `
		SELECT id, title, content, created_at
		FROM ellnyu.blogposts
		WHERE id=$1
	`, postID).Scan(&post.ID, &post.Title, &post.Content, &post.CreatedAt)
	if err != nil {
		http.Error(w, "post not found", http.StatusNotFound)
		return
	}

	rows, _ := db.Pool.Query(ctx, `
		SELECT t.tag
		FROM ellnyu.blogpost_tags bt
		JOIN ellnyu.tags t ON bt.tag_id = t.id
		WHERE bt.blogpost_id=$1
	`, postID)
	defer rows.Close()
	for rows.Next() {
		var tag string
		rows.Scan(&tag)
		post.Tags = append(post.Tags, tag)
	}

	rows, _ = db.Pool.Query(ctx, `
		SELECT c.category
		FROM ellnyu.blogpost_categories bc
		JOIN ellnyu.category c ON bc.category_id = c.id
		WHERE bc.post_id=$1
	`, postID)
	defer rows.Close()
	for rows.Next() {
		var cat string
		rows.Scan(&cat)
		post.Category = cat
	}

	rows, _ = db.Pool.Query(ctx, `
		SELECT i.url
		FROM ellnyu.blogpost_images bi
		JOIN ellnyu.images i ON bi.image_id = i.id
		WHERE bi.post_id=$1
		ORDER BY bi.position
	`, postID)
	defer rows.Close()
	for rows.Next() {
		var url string
		rows.Scan(&url)
		post.Images = append(post.Images, url)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func CreateBlogPostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("CreateSuggestionHandler: method not allowed", r.Method)
		return
	}
	var input BlogPostInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("CreateSuggestionHandler: failed to decode body:", err)
		return
	}

	_, err := CreateBlogPost(input)

	if err != nil {
		log.Printf("Somethiing fsiled %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)

}

func CreateBlogPost(input BlogPostInput) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := db.Pool.Begin(ctx)
	if err != nil {
		return -1, fmt.Errorf("failed to start tx: %w", err)
	}
	defer tx.Rollback(ctx) // rollback if anything fails

	// 1. Insert the post
	var postID int
	err = tx.QueryRow(ctx, `
		INSERT INTO ellnyu.blogposts (title, content)
		VALUES ($1, $2)
		RETURNING id
	`, input.Title, input.Content).Scan(&postID)
	if err != nil {
		return -1, fmt.Errorf("failed to insert blogpost: %w", err)
	}

	for _, tag := range input.Tags {
		var tagID int
		err = tx.QueryRow(ctx, `
			INSERT INTO ellnyu.tags (tag)
			VALUES ($1)
			ON CONFLICT (tag) DO UPDATE SET tag=EXCLUDED.tag
			RETURNING id
		`, tag).Scan(&tagID)
		if err != nil {
			return -1, fmt.Errorf("failed to insert/get tag: %w", err)
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO ellnyu.blogpost_tags (blogpost_id, tag_id)
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING
		`, postID, tagID)
		if err != nil {
			return -1, fmt.Errorf("failed to link tag: %w", err)
		}
	}

	for _, cat := range input.Category {
		var catID int
		err = tx.QueryRow(ctx, `
			INSERT INTO ellnyu.category (category)
			VALUES ($1)
			ON CONFLICT (category) DO UPDATE SET category=EXCLUDED.category
			RETURNING id
		`, cat).Scan(&catID)
		if err != nil {
			return -1, fmt.Errorf("failed to insert/get category: %w", err)
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO ellnyu.blogpost_categories (post_id, category_id)
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING
		`, postID, catID)
		if err != nil {
			return -1, fmt.Errorf("failed to link category: %w", err)
		}
	}

	for _, img := range input.Images {
		var imgID int
		err = tx.QueryRow(ctx, `
        INSERT INTO ellnyu.images (url)
        VALUES ($1)
        ON CONFLICT (url) DO UPDATE SET url = EXCLUDED.url
        RETURNING id
    `, img.Url).Scan(&imgID)
		if err != nil {
			return -1, fmt.Errorf("failed to insert image: %w", err)
		}

		_, err = tx.Exec(ctx, `
        INSERT INTO ellnyu.blogpost_images (post_id, image_id, position)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
    `, postID, imgID, img.Position)
		if err != nil {
			return -1, fmt.Errorf("failed to link image: %w", err)
		}
	}

	// Commit everything
	if err := tx.Commit(ctx); err != nil {
		return -1, fmt.Errorf("failed to commit: %w", err)
	}

	return postID, nil
}
