package handlers

import (
	"database/sql"
	"net/http"

	"github.com/Vanaraj10/Ticket-Booking-Go/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func UserSignupHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var req struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request format",
			})
			return
		}

		var exists bool
		err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", req.Username).Scan(&exists)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Database error",
			})
			return
		}
		if exists {
			c.JSON(http.StatusConflict, gin.H{
				"error": "Username already exists",
			})
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Password hashing failed",
			})
			return
		}
		_, err = db.Exec("INSERT INTO users (username, password_hash, role) VALUES ($1, $2, 'user')", req.Username, string(hash))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create user",
				"message": err.Error(),
			})
			return 
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "User created successfully",
		})
	}
}

func UserLoginHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username" binding:"required"`
			Password string `json:"password" binding:"required"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request format",
			})
			return
		}
		var id int
		var hash string
		var role string
		err := db.QueryRow("SELECT id, password_hash, role FROM users WHERE username = $1", req.Username).Scan(&id, &hash, &role)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return 
		}

		if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid username or password",
			})
			return
		}

		token, err := utils.GenerateJWT(id, role)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to generate token",
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"token":token,
			"role":role,
			"message": "Login successful",
		})
	}
}
