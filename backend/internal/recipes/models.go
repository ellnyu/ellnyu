package recipes

import (
	"database/sql"
	"time"
)

type Recipe struct {
	ID          int           `json:"id"`
	Name        string        `json:"name"`
	RecipeURL   string        `json:"recipeUrl"`
	Rating      sql.NullInt32 `json:"rating"`
	TriedDate   JSONTime      `json:"triedDate"`
	CreatedDate time.Time     `json:"createdAt"`
	Category    string        `json:"category"`
}

type RecipeInput struct {
	ID        int      `json:"id"`
	Name      string   `json:"name"`
	RecipeURL string   `json:"recipeUrl"`
	TriedDate JSONTime `json:"triedDate"`
	Category  string   `json:"category"`
	Images    []struct {
		Url string `json:"url"`
	} `json:"images"`
}

var input struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	RecipeURL string    `json:"recipeUrl"`
	TriedDate time.Time `json:"triedDate"`
}
