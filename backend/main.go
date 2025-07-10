package main

import (
	"fmt"
	"log"

	"github.com/Vanaraj10/Ticket-Booking-Go/config"
	"github.com/Vanaraj10/Ticket-Booking-Go/handlers"
	"github.com/Vanaraj10/Ticket-Booking-Go/middleware"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	fmt.Println("Connected to the database successfully")

	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	r.GET("/events", handlers.ListEventHandler(db))

	r.POST("/signup", handlers.UserSignupHandler(db))
	r.POST("/login", handlers.UserLoginHandler(db))

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuthMiddleware(), middleware.AdminOnly())
	admin.POST("/events", handlers.CreateEventHandler(db))

	user := r.Group("/api/user")
	user.Use(middleware.JWTAuthMiddleware())
	user.POST("/book", handlers.BookEventHandler(db))
	user.GET("/bookings",handlers.ListUserBookingsHandler(db))

	r.Run(":8080")
}