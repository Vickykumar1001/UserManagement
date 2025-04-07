package config

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

const (
	DBPath = "./users.db"
)

var DB *sql.DB

func InitializeDatabase() {
	var err error
	DB, err = sql.Open("sqlite", "./data/users.db")
	if err != nil {
		log.Fatal(err)
	}

	_, err = DB.Exec(`CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			email TEXT UNIQUE,
			phone TEXT,
			address TEXT,
			password TEXT,
			role TEXT);`)
	if err != nil {
		log.Fatal(err)
	}
}

func GetDB() *sql.DB {
	return DB
}
