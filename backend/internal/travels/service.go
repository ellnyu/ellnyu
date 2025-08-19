package travels

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/ellnyu/ellnyu/backend/config"
	"github.com/ellnyu/ellnyu/backend/internal/db"
	"log"
	"net/http"
	"time"
)

func CreateTravelHandler(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			log.Println("CreateTravelHandler: method not allowed", r.Method)
			return
		}

		var input struct {
			Location   string    `json:"location"`
			Country    string    `json:"country"`
			TravelDate time.Time `json:"travel_date"`
		}

		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			log.Println("CreateTravelHandler: failed to decode body:", err)
			return
		}

		log.Println("CreateTravelHandler: received location:", input.Location)

		// Insert into DB
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		lat, lon, err := GetCoordinates(cfg, input.Location, input.Country)
		if err != nil {
			http.Error(w, "error fetching coordinates", http.StatusBadGateway)
			log.Println("GetCoordinates error:", err)
			return
		}

		var travel Travel
		query := `
			INSERT INTO ellnyu.travels (location, country, latitude, longitude, travel_date)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING ID, location, country, latitude, longitude, travel_date
		`
		err = db.Pool.QueryRow(ctx, query,
			input.Location, input.Country, lat, lon, input.TravelDate,
		).Scan(&travel.ID, &travel.Location, &travel.Country, &travel.Latitude, &travel.Longitude, &travel.TravelDate)

		if err != nil {
			http.Error(w, "failed to insert travel: "+err.Error(), http.StatusInternalServerError)
			log.Println("CreateTravelHandler: DB insert error:", err)
			return
		}

		log.Println("CreateTravelHandler: inserted travel with ID:", travel.ID)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(travel)
	}
}

func GetTravelHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		log.Println("GetTravelHandler: method not allowed", r.Method)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
		SELECT *
		FROM ellnyu.travels
		ORDER BY travel_date DESC
	`)
	if err != nil {
		http.Error(w, "failed to fetch travels: "+err.Error(), http.StatusInternalServerError)
		log.Println("GetTravelHandler: DB query error:", err)
		return
	}
	defer rows.Close()

	var travels []Travel
	for rows.Next() {
		var r Travel
		if err := rows.Scan(&r.ID, &r.Location, &r.Country, &r.Latitude, &r.Longitude, &r.TravelDate); err != nil {
			http.Error(w, "failed to scan row: "+err.Error(), http.StatusInternalServerError)
			log.Println("GetSuggestionsHandler: row scan error:", err)
			return
		}
		travels = append(travels, r)
	}

	log.Printf("GetBooksHandler: returning %d books\n", len(travels))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(travels)
}

func GetCoordinates(cfg config.Config, location, country string) (float64, float64, error) {
	url := fmt.Sprintf("%sforward?access_key=%s&query=%s&country=%s", cfg.PositionStackURL, cfg.PositionStackKey, location, country)

	resp, err := http.Get(url)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to contact PositionStack API: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, 0, fmt.Errorf("PositionStack API error: status %d", resp.StatusCode)
	}

	var result PositionStackResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, 0, fmt.Errorf("failed to decode PositionStack response: %w", err)
	}

	if len(result.Data) == 0 {
		return 0, 0, fmt.Errorf("no coordinates found for %s, %s", location, country)
	}

	lat := result.Data[0].Latitude
	lng := result.Data[0].Longitude

	return lat, lng, nil
}
