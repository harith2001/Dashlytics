package adapter

import (
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
