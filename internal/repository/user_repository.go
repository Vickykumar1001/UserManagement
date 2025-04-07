package repository

import (
	"data_importer/internal/models"
	"database/sql"
	"errors"
	"fmt"
)

const (
	InsertStmt     = "INSERT INTO users (name, email, address, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)"
	GetByIdStmt    = "SELECT id, name, email, address, phone, role FROM users WHERE id = ?"
	GetByEmailStmt = "SELECT id, name, email, address, phone, password, role FROM users WHERE email = ?"
	GetStmt        = "SELECT id, name, email, address, phone, role FROM users"
	UpdateStmt     = "UPDATE users SET name = ?, email = ?, address = ?, phone = ?, role = ? WHERE id = ?"
	DeleteStmt     = "DELETE FROM users WHERE id = ?"
	ErrNotFound    = "record not found"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepo {
	return &UserRepository{DB: db}
}

func (repo *UserRepository) CreateUser(user *models.User) (int64, error) {

	stmt, err := repo.DB.Prepare(InsertStmt)
	if err != nil {
		return 0, err
	}
	defer stmt.Close()
	fmt.Println(&user)
	fmt.Println(user.Password)
	res, err := stmt.Exec(user.Name, user.Email, user.Address, user.Phone, user.Password, user.Role)
	if err != nil {
		return 0, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (repo *UserRepository) BulkCreateUsers(users []models.User) error {
	tx, err := repo.DB.Begin()
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(InsertStmt)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()

	for _, user := range users {
		fmt.Println(user)
		fmt.Println(user.Password)
		_, err := stmt.Exec(user.Name, user.Email, user.Address, user.Phone, user.Password, user.Role)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}

func (repo *UserRepository) GetUserByID(id int) (*models.User, error) {
	user := &models.User{}
	err := repo.DB.QueryRow(GetByIdStmt, id).
		Scan(&user.ID, &user.Name, &user.Email, &user.Address, &user.Phone, &user.Role)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New(ErrNotFound)
		}
		return nil, err
	}
	return user, nil
}
func (repo *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	user := &models.User{}
	err := repo.DB.QueryRow(GetByEmailStmt, email).
		Scan(&user.ID, &user.Name, &user.Email, &user.Address, &user.Phone, &user.Password, &user.Role)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New(ErrNotFound)
		}
		return nil, err
	}
	return user, nil
}

func (repo *UserRepository) GetAllUsers() ([]models.User, error) {
	rows, err := repo.DB.Query(GetStmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		user := models.User{}
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.Address, &user.Phone, &user.Role)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (repo *UserRepository) UpdateUser(user *models.User) error {
	stmt, err := repo.DB.Prepare(UpdateStmt)
	if err != nil {
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(user.Name, user.Email, user.Address, user.Phone, user.Role, user.ID)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New(ErrNotFound)
	}

	return nil
}

func (repo *UserRepository) DeleteUser(id int) error {
	stmt, err := repo.DB.Prepare(DeleteStmt)
	if err != nil {
		return err
	}
	defer stmt.Close()

	res, err := stmt.Exec(id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New(ErrNotFound)
	}

	return nil
}
