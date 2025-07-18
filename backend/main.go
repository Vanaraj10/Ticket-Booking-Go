package main

import (
	"fmt"
	"log"

	"github.com/Vanaraj10/Ticket-Booking-Go/config"
	"github.com/Vanaraj10/Ticket-Booking-Go/handlers"
	"github.com/Vanaraj10/Ticket-Booking-Go/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq" // PostgreSQL driver
)

func main() {

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"*"} // Allow all origins
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	fmt.Println("Connected to the database successfully")

	r := gin.Default()
	r.Use(cors.New(corsConfig)) // Enable CORS

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
	admin.DELETE("/events/:event_id", handlers.DeleteEventHandler(db))
	admin.GET("/events/:event_id/bookings",handlers.ListEventBookingsHandler(db))
	admin.POST("/validate-booking",handlers.ValidateBookingHandler(db))

	user := r.Group("/api/user")
	user.Use(middleware.JWTAuthMiddleware())
	user.POST("/book", handlers.BookEventHandler(db))
	user.GET("/bookings",handlers.ListUserBookingsHandler(db))
	user.DELETE("/bookings/:booking_id",handlers.CancelBookingHandler(db))

	r.Run(":8080")
}