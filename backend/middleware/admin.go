package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetString("role")
		if role != "admin" {
			c.JSON(http.StatusForbidden,gin.H{
				"error": "Access denied: Admins only",
			})
			c.Abort()
			return 
		}
		c.Next()
	}
}