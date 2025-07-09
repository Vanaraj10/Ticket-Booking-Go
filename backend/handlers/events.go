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
