package main

import (
	"fmt"
	"log"

	"github.com/Vanaraj10/Ticket-Booking-Go/config"
	"github.com/Vanaraj10/Ticket-Booking-Go/handlers"
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

	r.POST("/signup",handlers.UserSignupHandler(db))

	r.Run(":8080") // listen and serve on
}