package repository

import "data_importer/internal/models"

type UserRepo interface {
	CreateUser(user *models.User) (int64, error)
	BulkCreateUsers(users []models.User) error
	GetUserByID(id int) (*models.User, error)
	GetAllUsers() ([]models.User, error)
	UpdateUser(user *models.User) error
	DeleteUser(id int) error
}
