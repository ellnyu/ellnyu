package travels

import "time"

type PositionStackResponse struct {
	Data []PositionStackData `json:"data"`
}

// PositionStackData represents one location result
type PositionStackData struct {
	Label     string  `json:"label"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Travel struct {
	ID         int       `json:"id"`
	Location   string    `json:"location"`
	Country    string    `json:"country"`
	Latitude   float64   `json:"latitude"`
	Longitude  float64   `json:"longitude"`
	TravelDate time.Time `json:"travel_date"`
}
