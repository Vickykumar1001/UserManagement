package services

import (
	"data_importer/internal/models"
	"data_importer/internal/repository"
	"fmt"
	"log"

	"github.com/xuri/excelize/v2"
)

type ImportService struct {
	userRepo repository.UserRepo
}

func NewImportService(userRepo repository.UserRepo) *ImportService {
	return &ImportService{
		userRepo: userRepo,
	}
}

func (s *ImportService) ImportExcelData(filepath string) error {
	f, err := excelize.OpenFile(filepath)
	if err != nil {
		return fmt.Errorf("failed to open excel file: %w", err)
	}
	defer func() {
		if err := f.Close(); err != nil {
			log.Printf("Error closing excel file: %v", err)
		}
	}()

	// getting all the rows in the Sheet1
	rows, err := f.GetRows("Sheet1")
	if err != nil {
		return fmt.Errorf("failed to get rows: %w", err)
	}

	// Checking if data is there or not
	if len(rows) < 2 {
		return fmt.Errorf("excel file has no data rows")
	}

	// skiping header row
	dataRows := rows[1:]
	users := make([]models.User, 0)

	for _, row := range dataRows {

		user := models.User{
			Name:     row[0],
			Address:  row[1],
			Email:    row[2],
			Phone:    row[3],
			Password: row[4],
			Role:     row[5],
		}
		users = append(users, user)
	}

	// adding users to database
	err = s.userRepo.BulkCreateUsers(users)
	if err != nil {
		return fmt.Errorf("failed to insert users into database: %w", err)
	}

	log.Printf("Successfully imported %d users", len(users))
	return nil
}
