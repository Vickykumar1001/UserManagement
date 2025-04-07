package config

import (
	"data_importer/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var SecretKey = "mysecretkey"

func GenerateJWT(user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"ID":    user.ID,
		"Email": user.Email,
		"Role":  user.Role,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}
