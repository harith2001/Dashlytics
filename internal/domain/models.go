package domain

import "time"

type Transaction struct {
	ID          string
	Date        time.Time
	UserID      string
	Country     string
	Region      string
	ProductID   string
	ProductName string
	Category    string
	Price       float64
	Quantity    int
	TotalPrice  float64
	Stock       int
	AddedDate   time.Time
}
