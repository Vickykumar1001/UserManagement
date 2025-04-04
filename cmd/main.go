package main

import (
	"data_importer/internal/config"
	"data_importer/internal/handler"
	"data_importer/internal/repository"
	"data_importer/internal/services"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// initialize database
	config.InitializeDatabase()
	db := config.GetDB()
	defer db.Close()

	userRepo := repository.NewUserRepository(db)
	importService := services.NewImportService(userRepo)
	userHandler := handler.NewUserHandler(userRepo)

	// import data
	err := importService.ImportExcelData("./data/data.xlsx")
	if err != nil {
		log.Printf("Error importing data: %v", err)
	}

	router := gin.Default()

	router.GET("/users", userHandler.GetAllUsers)
	router.GET("/users/:id", userHandler.GetUser)
	router.POST("/users", userHandler.CreateUser)
	router.PUT("/users/:id", userHandler.UpdateUser)
	router.DELETE("/users/:id", userHandler.DeleteUser)
	router.Static("/assets", "./frontend/dist/assets")
	router.StaticFile("/favicon.ico", "./frontend/dist/favicon.ico")

	router.NoRoute(func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
