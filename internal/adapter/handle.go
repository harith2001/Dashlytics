package adapter

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"

	"Dashlytics/internal/repository"
)

// response structure
type CountryRevenue struct {
	Country          string  `json:"country"`
	ProductName      string  `json:"product_name"`
	TotalRevenue     float64 `json:"total_revenue"`
	TransactionCount int     `json:"transaction_count"`
}

// CountryRevenueHandler godoc
// @Summary Get country-level revenue data
// @Description Returns a list of countries with total revenue and transaction count per product
// @Tags revenue
// @Produce json
// @Success 200 {array} adapter.CountryRevenue
// @Router /country-revenue [get]
func GetCountryRevenue(w http.ResponseWriter, r *http.Request) {
	data := repository.GlobalDataStore
	countryRevenueMap := map[string]map[string]*CountryRevenue{}

	//aggreegate Data
	for _, t := range data.AllTransactions {
		if _, ok := countryRevenueMap[t.Country]; !ok {
			countryRevenueMap[t.Country] = make(map[string]*CountryRevenue)
		}
		productMap := countryRevenueMap[t.Country]
		if _, ok := productMap[t.ProductName]; !ok {
			productMap[t.ProductName] = &CountryRevenue{
				Country:          t.Country,
				ProductName:      t.ProductName,
				TotalRevenue:     0,
				TransactionCount: 0,
			}
		}
		productMap[t.ProductName].TotalRevenue += t.TotalPrice
		productMap[t.ProductName].TransactionCount++
	}

	//flatten and sort data
	var result []CountryRevenue
	for _, productMap := range countryRevenueMap {
		for _, entry := range productMap {
			result = append(result, *entry)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].TotalRevenue > result[j].TotalRevenue
	})

	//Get "limit" from query param
	limit := 100 // default
	if l := r.URL.Query().Get("limit"); l != "" {
		if parsed, err := strconv.Atoi(l); err == nil && parsed > 0 {
			limit = parsed
		}
	}
	if len(result) > limit {
		result = result[:limit]
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}
