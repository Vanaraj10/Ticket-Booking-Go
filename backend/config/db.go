package config

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func ConnectDB() (*sql.DB,error) {
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")

	if dbURL == "" {
		return nil, fmt.Errorf("DB_URL is not set in env")
	}
	db, err := sql.Open("postgres", dbURL)

	if err != nil {
		return nil, err
	}
	if err := db.Ping() ; err != nil {
		return  nil, err
	}
	return db, nil
}