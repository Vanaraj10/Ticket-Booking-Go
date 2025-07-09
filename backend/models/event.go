package models

import "time"

type Event struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	TotalTickets     int       `json:"total_tickets"`
	AvailableTickets int       `json:"available_tickets"`
	EventDate        time.Time `json:"event_date"`
	CreatedBy        int       `json:"created_by"` // User ID of the creator
}
