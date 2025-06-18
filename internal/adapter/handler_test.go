package adapter

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"Dashlytics/internal/domain"
	"Dashlytics/internal/repository"
)

// Fake data for testing
func mockTransactions() []domain.Transaction {
	return []domain.Transaction{
		{Date: parseDate("2023-01-01"), Quantity: 10},
		{Date: parseDate("2023-01-15"), Quantity: 20},
		{Date: parseDate("2023-02-01"), Quantity: 15},
	}
}

func parseDate(d string) time.Time {
	t, _ := domain.ParseDate(d)
	return t
}

// Test handler response
func TestMonthlySalesHandler(t *testing.T) {
	// Inject mock data
	repository.InitDataStore(mockTransactions())

	req, err := http.NewRequest("GET", "/api/monthly-sales", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetMonthlySales)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	if len(rr.Body.String()) == 0 {
		t.Errorf("Expected non-empty body, got %v", rr.Body.String())
	}
}

func mustParseDate(s string) time.Time {
	t, _ := time.Parse("2006-01-02", s)
	return t
}

func TestCountryRevenueHandler(t *testing.T) {
	mockData := []domain.Transaction{
		{ID: "1", Country: "USA", ProductName: "Widget", Quantity: 2, TotalPrice: 20, Date: mustParseDate("2024-01-01")},
		{ID: "2", Country: "USA", ProductName: "Widget", Quantity: 1, TotalPrice: 10, Date: mustParseDate("2024-01-02")},
		{ID: "3", Country: "Canada", ProductName: "Gadget", Quantity: 3, TotalPrice: 30, Date: mustParseDate("2024-01-03")},
	}
	repository.InitDataStore(mockData)

	req := httptest.NewRequest(http.MethodGet, "/api/country-revenue?limit=10", nil)
	rr := httptest.NewRecorder()

	GetCountryRevenue(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", rr.Code)
	}

	var result []CountryRevenue
	if err := json.Unmarshal(rr.Body.Bytes(), &result); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if len(result) != 2 {
		t.Errorf("Expected 2 entries, got %d", len(result))
	}
}

func TestTopProductsHandler(t *testing.T) {
	mockData := []domain.Transaction{
		{ProductName: "Widget", Quantity: 5, Stock: 100},
		{ProductName: "Widget", Quantity: 3, Stock: 100},
		{ProductName: "Gadget", Quantity: 7, Stock: 200},
	}
	repository.InitDataStore(mockData)

	req := httptest.NewRequest(http.MethodGet, "/api/top-products", nil)
	rr := httptest.NewRecorder()

	GetTopProducts(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", rr.Code)
	}

	var result []TopProduct
	if err := json.Unmarshal(rr.Body.Bytes(), &result); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if result[0].ProductName != "Widget" {
		t.Errorf("Expected Widget first, got %s", result[0].ProductName)
	}
}

func TestTopRegionsHandler(t *testing.T) {
	mockData := []domain.Transaction{
		{Region: "California", TotalPrice: 100, Quantity: 4},
		{Region: "Ontario", TotalPrice: 50, Quantity: 2},
		{Region: "California", TotalPrice: 200, Quantity: 6},
	}
	repository.InitDataStore(mockData)

	req := httptest.NewRequest(http.MethodGet, "/api/top-regions", nil)
	rr := httptest.NewRecorder()

	GetTopRegions(rr, req)

	if rr.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d", rr.Code)
	}

	var result []RegionStats
	if err := json.Unmarshal(rr.Body.Bytes(), &result); err != nil {
		t.Fatalf("Failed to parse response: %v", err)
	}

	if result[0].Region != "California" {
		t.Errorf("Expected California first, got %s", result[0].Region)
	}
}
