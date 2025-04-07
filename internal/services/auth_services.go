package services

import (
	"data_importer/internal/config"
	"data_importer/internal/models"
	"data_importer/internal/repository"
	"errors"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserRepo repository.UserRepo
}

func NewAuthService(repo repository.UserRepo) *AuthService {
	return &AuthService{UserRepo: repo}
}

func (service *AuthService) Signup(user *models.User) (int64, error) {
	fmt.Println("user unhased password", user.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return -1, err
	}
	fmt.Println("user hased password", string(hashedPassword))

	user.Password = string(hashedPassword)
	return service.UserRepo.CreateUser(user)
}

func (service *AuthService) Login(email, password string) (string, error) {
	user, err := service.UserRepo.GetUserByEmail(email)
	if err != nil {
		return "", err
	}
	if user == nil {
		return "", errors.New("user not found with this Email")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid username or password")
	}

	token, err := config.GenerateJWT(user)
	if err != nil {
		return "", err
	}

	return token, nil
}
