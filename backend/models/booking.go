package models

import "time"

type Booking struct {
	ID            int       `json:"id"`
	UserID        int       `json:"user_id"`        // ID of the user who made the booking
	EventID       int       `json:"event_id"`       // ID of the booked event
	TicketsBooked int       `json:"tickets_booked"` // Number of tickets booked
	BookedAt      time.Time `json:"booked_at"`      // Timestamp of when the booking was made
}
