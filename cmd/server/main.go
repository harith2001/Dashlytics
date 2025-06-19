package main

import (
	"fmt"
	"log"
	"net/http"

	"Dashlytics/internal/adapter"
	"Dashlytics/internal/repository"

	_ "Dashlytics/docs"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	httpSwagger "github.com/swaggo/http-swagger"
)

// @title Dashlytics API
// @version 1.0
// @description Backend for visualizing large-scale CSV analytics in Go
// @contact.name Harith
// @host localhost:8080
// @BasePath /api/v1
func main() {
	csvFilePath := "data/GO_test_5m.csv"
	transactions, err := repository.LoadCSV(csvFilePath)
	if err != nil {
		log.Fatalf("Error loading CSV file: %v", err)
	}
	fmt.Printf("Loaded %d transactions\n", len(transactions))

	//preprocess and cache indexed data (large dataset)
	repository.InitDataStore(transactions)

	r := chi.NewRouter()
	//CORS middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"}, // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	// Swagger endpoint
	r.Get("/swagger/*", httpSwagger.WrapHandler)

	//register routes
	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/country-revenue", adapter.GetCountryRevenue)
		r.Get("/top-products", adapter.GetTopProducts)
		r.Get("/monthly-sales", adapter.GetMonthlySales)
		r.Get("/top-regions", adapter.GetTopRegions)
	})

	//start server
	fmt.Println("Starting server on :8080")
	// swagger endpoint
	fmt.Println("Swagger UI available at http://localhost:8080/swagger/index.html")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
