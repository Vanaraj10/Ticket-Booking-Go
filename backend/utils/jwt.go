package utils

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

func GenerateJWT(userID int, role string) (string, error) {
	claims := jwt.MapClaims {
		"user_id": userID,
		"role": role,
		"exp": time.Now().Add(time.Hour * 100).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	return token.SignedString(jwtKey)
}