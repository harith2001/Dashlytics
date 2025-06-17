package adapter

import (
	"encoding/json"
	"net/http"
	"sort"
	"strconv"

	"Dashlytics/internal/repository"
)

// CountryRevenue represents revenue data for a country and product
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

// TopProduct represents a product with total quantity sold and stock

type TopProduct struct {
	ProductName       string `json:"product_name"`
	TotalQuantitySold int    `json:"total_quantity_sold"`
	StockQuantity     int    `json:"stock_quantity"`
}

// TopProductsHandler godoc
// @Summary Get top 20 most frequently purchased products
// @Description Returns top products with quantity sold and stock
// @Tags products
// @Produce json
// @Success 200 {array} TopProduct
// @Router /top-products [get]
func GetTopProducts(w http.ResponseWriter, r *http.Request) {
	data := repository.GlobalDataStore
	topProductsMap := make(map[string]*TopProduct)

	// Aggregate data
	for _, t := range data.AllTransactions {
		if _, ok := topProductsMap[t.ProductName]; !ok {
			topProductsMap[t.ProductName] = &TopProduct{
				ProductName:       t.ProductName,
				TotalQuantitySold: 0,
				StockQuantity:     t.Stock,
			}
		}
		topProductsMap[t.ProductName].TotalQuantitySold += t.Quantity
	}

	//flatten and sort data
	var result []TopProduct
	for _, entry := range topProductsMap {
		result = append(result, *entry)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].TotalQuantitySold > result[j].TotalQuantitySold
	})

	// Limit to top 20 products
	limit := 20
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

// MonthlySales represents total quantity sold per month

type MonthlySales struct {
	Month             string `json:"month"` //format: "YYYY-MM"
	TotalQuantitySold int    `json:"total_quantity_sold"`
}

// MonthlySalesHandler godoc
// @Summary Get total quantity sold per month
// @Description Returns quantity of items sold grouped by month
// @Tags sales
// @Produce json
// @Success 200 {array} MonthlySales
// @Router /monthly-sales [get]
func GetMonthlySales(w http.ResponseWriter, r *http.Request) {
	data := repository.GlobalDataStore
	salesMap := make(map[string]int)

	//Group by month
	for _, t := range data.AllTransactions {
		monthKey := t.Date.Format("2006-01") // YYYY-MM format
		salesMap[monthKey] += t.Quantity
	}

	//convert to slice
	var result []MonthlySales
	for month, qty := range salesMap {
		result = append(result, MonthlySales{
			Month:             month,
			TotalQuantitySold: qty,
		})
	}

	//sort by month
	sort.Slice(result, func(i, j int) bool {
		return result[i].Month < result[j].Month
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

type RegionStats struct {
	Region        string  `json:"region"`
	TotalRevenue  float64 `json:"total_revenue"`
	TotalItemSold int     `json:"total_item_sold"`
}

// TopRegionsHandler godoc
// @Summary Get top 30 regions by total revenue and items sold
// @Description Returns regions with highest sales and revenue
// @Tags regions
// @Produce json
// @Success 200 {array} RegionStats
// @Router /top-regions [get]
func GetTopRegions(w http.ResponseWriter, r *http.Request) {
	data := repository.GlobalDataStore
	regionMap := make(map[string]*RegionStats)

	// Aggregate data
	for _, t := range data.AllTransactions {
		if _, ok := regionMap[t.Region]; !ok {
			regionMap[t.Region] = &RegionStats{
				Region:        t.Region,
				TotalRevenue:  0,
				TotalItemSold: 0,
			}
		}
		regionMap[t.Region].TotalRevenue += t.TotalPrice
		regionMap[t.Region].TotalItemSold += t.Quantity
	}

	// Convert to slice
	var result []RegionStats
	for _, entry := range regionMap {
		result = append(result, *entry)
	}

	// Sort by total revenue decending
	sort.Slice(result, func(i, j int) bool {
		return result[i].TotalRevenue > result[j].TotalRevenue
	})

	// Get "limit" from query param
	limit := 30 // default
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
