package main

import (
	"data_importer/internal/config"
	"data_importer/internal/handler"
	"data_importer/internal/middlewares"
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

	authService := services.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)
	// import data
	err := importService.ImportExcelData("./data/data.xlsx")
	if err != nil {
		log.Printf("Error importing data: %v", err)
	}

	router := gin.Default()

	// auth routes
	router.POST("/signup", authHandler.Signup)
	router.POST("/login", authHandler.Login)
	userAuth := router.Group("/users", middlewares.Authorization())
	userAuth.GET("/", middlewares.AuthorizeRoles("User", "Admin", "SuperAdmin"), userHandler.GetAllUsers)
	userAuth.GET("/:id", middlewares.AuthorizeRoles("User", "Admin", "SuperAdmin"), userHandler.GetUser)
	userAuth.POST("/", middlewares.AuthorizeRoles("Admin", "SuperAdmin"), userHandler.CreateUser)
	userAuth.PUT("/:id", middlewares.AuthorizeRoles("Admin", "SuperAdmin"), userHandler.UpdateUser)
	userAuth.DELETE("/:id", middlewares.AuthorizeRoles("SuperAdmin"), userHandler.DeleteUser)
	router.Static("/assets", "./frontend/dist/assets")
	router.StaticFile("/favicon.ico", "./frontend/dist/favicon.ico")

	router.NoRoute(func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	if err := router.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
