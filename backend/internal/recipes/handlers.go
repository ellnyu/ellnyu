package recipes

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ellnyu/ellnyu/backend/internal/db"
)

type JSONTime struct {
	sql.NullTime
}

func (jt JSONTime) MarshalJSON() ([]byte, error) {
	if !jt.Valid {
		return []byte("null"), nil
	}
	return json.Marshal(jt.Time)
}

type Recipe struct {
	ID          int           `json:"id"`
	Name        string        `json:"name"`
	RecipeURL   string        `json:"recipeUrl"`
	Rating      sql.NullInt32 `json:"rating"`
	TriedDate   JSONTime      `json:"triedDate"`
	CreatedDate time.Time     `json:"createdAt"`
	Category    string        `json:"category"`
}

func CreateRecipeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("CreateRecipeHandler: method not allowed", r.Method)
		return
	}

	var input struct {
		ID        int       `json:"id"`
		Name      string    `json:"name"`
		RecipeURL string    `json:"recipeUrl"`
		TriedDate time.Time `json:"triedDate"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("CreateSuggestionHandler: failed to decode body:", err)
		return
	}

	log.Println("CreateRecipesHandler: received suggestion:", input.Name)

	// Insert into DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var recipe Recipe

	query := `
		INSERT INTO ellnyu.recipes (name, recipe_url)
		VALUES ($1, $2)
		RETURNING ID, name
	`
	err := db.Pool.QueryRow(ctx, query,
		input.Name, input.RecipeURL,
	).Scan(&recipe.ID, &recipe.Name)

	if err != nil {
		http.Error(w, "failed to insert review: "+err.Error(), http.StatusInternalServerError)
		log.Println("CreateRecipeHandler: DB insert error:", err)
		return
	}

	log.Println("CreateRecipeHandler: inserted suggestion with ID:", recipe.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

func GetRecipesHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("GetRecipesHandler: method not allowed", r.Method)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT id, name, recipe_url, rating, created_at, tried_date 
		FROM ellnyu.recipes
		ORDER BY created_at DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch recipes: "+err.Error(), http.StatusInternalServerError)
		log.Println("GetRecipesHandler: DB query error:", err)
		return
	}
	defer rows.Close()

	var recipes []Recipe
	for rows.Next() {
		var r Recipe
		if err := rows.Scan(&r.ID, &r.Name, &r.RecipeURL, &r.Rating, &r.CreatedDate, &r.TriedDate); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			log.Println("GetRecipesHandler: row scan error:", err)
			return
		}

		// Fetch category for this recipe
		var category sql.NullString
		err = db.Pool.QueryRow(ctx, `
			SELECT c.category
			FROM ellnyu.category c
			JOIN ellnyu.recipe_categories rc ON rc.category_id = c.id
			WHERE rc.recipe_id = $1
			LIMIT 1
		`, r.ID).Scan(&category)
		if err != nil && err != sql.ErrNoRows {
			log.Println("Error fetching category for recipe", r.ID, ":", err)
		}

		if category.Valid {
			r.Category = category.String
		} else {
			r.Category = "" // or keep empty string for no category
		}
		recipes = append(recipes, r)
	}

	log.Printf("GetRecipesHandler: returning %d recipes\n", len(recipes))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recipes)
}

func InsertRatingHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("CreateRecipeHandler: method not allowed", r.Method)
		return
	}
	var input struct {
		ID        int       `json:"id"`
		Rating    int       `json:"rating"`
		TriedDate time.Time `json:"triedDate"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		log.Println("CreateRecipeHandler: failed to decode body:", err)
		return
	}

	// Insert into DB
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var recipe Recipe

	query := `
  UPDATE ellnyu.recipes
  SET rating = $1, tried_date = $2
  WHERE id = $3
  RETURNING id, name
`
	err := db.Pool.QueryRow(ctx, query,
		input.Rating, input.TriedDate, input.ID,
	).Scan(&recipe.ID, &recipe.Name)

	if err != nil {
		http.Error(w, "failed to insert review: "+err.Error(), http.StatusInternalServerError)
		log.Println("InsertRatingHandler: DB insert error:", err)
		return
	}

	log.Println("InsertRatingHandler: inserted suggestion with ID:", recipe.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(input)
}

// func DeleteRecipeHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodDelete {
// 		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
// 		log.Println("DeleteBookHandler: method not allowed", r.Method)
// 		return
// 	}
//
// 	var input struct {
// 		Title  string `json:"title"`
// 		Author string `json:"author"`
// 	}
// 	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
// 		http.Error(w, "invalid request body", http.StatusBadRequest)
// 		log.Println("DeleteBookHandler: failed to decode body:", err)
// 		return
// 	}
//
// 	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()
//
// 	res, err := db.Pool.Exec(ctx,
// 		`DELETE FROM ellnyu.books WHERE title=$1 AND author=$2`,
// 		input.Title, input.Author,
// 	)
// 	if err != nil {
// 		http.Error(w, "failed to delete book: "+err.Error(), http.StatusInternalServerError)
// 		log.Println("DeleteBookHandler: DB exec error:", err)
// 		return
// 	}
//
// 	count := res.RowsAffected()
// 	log.Printf("DeleteBookHandler: deleted %d rows\n", count)
//
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(map[string]any{
// 		"deleted": count,
// 	})
// }
