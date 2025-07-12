package handlers

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateEventHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Name         string    `json:"name" binding:"required"`
			Description  string    `json:"description" binding:"required"`
			TotalTickets int       `json:"total_tickets" binding:"required"`
			EventDate    time.Time `json:"event_date" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request data",
				"message": err.Error(),
			})
			return
		}

		adminID := c.GetInt("user_id")
		_, err := db.Exec(
			`INSERT INTO events (name, description, total_tickets, available_tickets, event_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)`,
			req.Name, req.Description, req.TotalTickets, req.TotalTickets, req.EventDate, adminID,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to create event",
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusCreated, gin.H{
			"message": "Event created successfully",
		})
	}
}
func ListEventHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		rows, err := db.Query(`SELECT id, name, description, total_tickets, available_tickets, event_date, created_by FROM events ORDER BY event_date DESC`)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to retrieve events",
				"message": err.Error(),
			})
			return
		}
		defer rows.Close()

		events := []map[string]interface{}{}
		for rows.Next() {
			var id, TotalTickets, AvailableTickets, CreatedBy int
			var Name, Description string
			var EventDate time.Time
			if err := rows.Scan(&id, &Name, &Description, &TotalTickets, &AvailableTickets, &EventDate, &CreatedBy); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to scan event data",
					"message": err.Error(),
				})
				return
			}
			events = append(events, map[string]interface{}{
				"id":                id,
				"name":              Name,
				"description":       Description,
				"total_tickets":     TotalTickets,
				"available_tickets": AvailableTickets,
				"event_date":        EventDate,
				"created_by":        CreatedBy,
			})
		}
		c.JSON(http.StatusOK, gin.H{
			"events": events,
		})
	}
}
func BookEventHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			EventID       int `json:"event_id" binding:"required"`
			TicketsBooked int `json:"tickets_booked" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request data",
				"message": err.Error(),
			})
		}

		userID := c.GetInt("user_id")
		var available int
		err := db.QueryRow(`SELECT available_tickets FROM events WHERE id = $1`, req.EventID).Scan(&available)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Event not found",
				"message": err.Error(),
			})
		}
		if req.TicketsBooked > available {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Not enough tickets available",
				"message": "Requested tickets exceed available tickets",
			})
			return
		}

		tx, err := db.Begin()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to start transaction",
				"message": err.Error(),
			})
			return
		}
		defer tx.Rollback()

		_, err = tx.Exec(`INSERT INTO bookings (user_id, event_id, tickets_booked) VALUES ($1, $2, $3)`, userID, req.EventID, req.TicketsBooked)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to book tickets",
				"message": err.Error(),
			})
			return
		}

		_, err = tx.Exec(`UPDATE events SET available_tickets = available_tickets - $1 WHERE id = $2`, req.TicketsBooked, req.EventID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to update available tickets",
				"message": err.Error(),
			})
			return
		}
		if err := tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to commit transaction",
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Tickets booked successfully",
		})
	}
}
func ListUserBookingsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetInt("user_id")

		rows, err := db.Query(`SELECT b.id, b.event_id,e.name, b.tickets_booked, b.booked_at, e.event_date, b.code, b.used
			                   FROM bookings b
							   JOIN events e ON b.event_id = e.id
							   WHERE b.user_id = $1
							   ORDER BY b.booked_at DESC	
		`, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to retrieve bookings",
				"message": err.Error(),
			})
			return
		}
		defer rows.Close()

		bookings := []map[string]interface{}{}
		for rows.Next() {
			var id, eventID, ticketsBooked int
			var eventName,code string
			var used bool
			var bookedAt,eventDate time.Time
			if err := rows.Scan(&id, &eventID, &eventName, &ticketsBooked, &bookedAt,&eventDate,&code,&used); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to scan booking data",
					"message": err.Error(),
				})
				return
			}
			bookings = append(bookings, map[string]interface{}{
				"id":             id,
				"event_id":       eventID,
				"event_name":     eventName,
				"tickets_booked": ticketsBooked,
				"booked_at":      bookedAt,
				"event_date":     eventDate,
				"code":           code,
				"used":           used,
			})
		}
		c.JSON(http.StatusOK, gin.H{
			"bookings": bookings,
		})
	}
}
func ListEventBookingsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		eventID := c.Param("event_id")

		rows, err := db.Query(`SELECT b.id, u.username, b.tickets_booked, b.booked_at, e.name
							   FROM bookings b
							   JOIN users u ON b.user_id=u.id
							   JOIN events e ON b.event_id = e.id
							   WHERE b.event_id = $1
							   ORDER BY b.booked_at DESC
							   `, eventID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to retrieve bookings",
				"message": err.Error(),
			})
			return
		}
		defer rows.Close()

		bookings := []map[string]interface{}{}
		for rows.Next() {
			var id, tickets_booked int
			var username,eventName string
			var bookedAt time.Time
			if err := rows.Scan(&id, &username, &tickets_booked, &bookedAt,&eventName); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":   "Failed to scan booking data",
					"message": err.Error(),
				})
			}
			bookings = append(bookings, map[string]interface{}{
				"id":             id,
				"event_name":     eventName, // Assuming eventID is the name of the event
				"username":       username,
				"tickets_booked": tickets_booked,
				"booked_at":      bookedAt,
			})
		}
		c.JSON(http.StatusOK, gin.H{"bookings": bookings})
	}
}
func DeleteEventHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		eventID := c.Param("event_id")

		res, err := db.Exec(`DELETE FROM events WHERE id = $1`, eventID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to delete event",
				"message": err.Error(),
			})
			return
		}
		rowsAffected, _ := res.RowsAffected()
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Event not found",
				"message": "No event found with the given ID",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message":"Event Deleted Successfully",
		})
	}
}
func CancelBookingHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		bookingID := c.Param("booking_id")
		userID := c.GetInt("user_id")

		var eventDate time.Time
		var ticketsBooked, eventID int
		err := db.QueryRow(`SELECT b.tickets_booked, b.event_id, e.event_date
							FROM bookings b
							JOIN events e ON b.event_id = e.id
							WHERE b.id = $1 AND b.user_id = $2`,bookingID, userID).Scan(&ticketsBooked, &eventID, &eventDate)

	    if err != nil {
			c.JSON(http.StatusNotFound,gin.H{
				"error":   "Booking not found",
				"message": "No booking found with the given ID for the user",
			})
			return
		}
		if time.Now().After(eventDate) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Cannot cancel booking",
				"message": "Booking cannot be cancelled after the event date",
			})
			return
		}
		tx, err := db.Begin()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to start transaction",
				"message": err.Error(),
			})
			return
		}
		defer tx.Rollback()

		_,err = tx.Exec(`DELETE FROM bookings WHERE id = $1 AND user_id = $2`, bookingID, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to cancel booking",
				"message": err.Error(),
			})
			return
		}
		_, err = tx.Exec(`UPDATE events SET available_tickets = available_tickets + $1 WHERE id = $2`,ticketsBooked, eventID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to update available tickets",
				"message": err.Error(),
			})
			return
		}
		if err := tx.Commit(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to commit transaction",
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Booking cancelled successfully",
		})
	}
}
func ValidateBookingHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Code string `json:"code" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid request data",
				"message": err.Error(),
			})
			return
		}

		var used bool
		err := db.QueryRow(`SELECT used FROM bookings WHERE code = $1`,req.Code).Scan(&used)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Booking not found",
				"message": "No booking found with the given code",
			})
		}
		if used {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Booking already used",
				"message": "This booking code has already been used",
			})
			return
		}
		_, err = db.Exec(`UPDATE bookings SET used = true WHERE code = $1`, req.Code)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to validate booking",
				"message": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": "Booking validated successfully",
		})
	}
}