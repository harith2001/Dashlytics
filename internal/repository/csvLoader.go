package repository

import (
	"encoding/csv"
	"io"
	"os"
	"strconv"
	"time"

	"Dashlytics/internal/domain"
)

// loadCSV reads a CSV file and returns a slice of Transaction structs.
func LoadCSV(filePath string) ([]domain.Transaction, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, _ = reader.Read() // Skip header row
	var transactions []domain.Transaction
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		price, _ := strconv.ParseFloat(record[8], 64)
		quantity, _ := strconv.Atoi(record[9])
		totalPrice, _ := strconv.ParseFloat(record[10], 64)
		stock, _ := strconv.Atoi(record[11])
		txDate, _ := time.Parse("2006-01-02", record[1])
		addedDate, _ := time.Parse("2006-01-02", record[12])

		t := domain.Transaction{
			ID:          record[0],
			Date:        txDate,
			UserID:      record[2],
			Country:     record[3],
			Region:      record[4],
			ProductID:   record[5],
			ProductName: record[6],
			Category:    record[7],
			Price:       price,
			Quantity:    quantity,
			TotalPrice:  totalPrice,
			Stock:       stock,
			AddedDate:   addedDate,
		}
		transactions = append(transactions, t)
	}
	return transactions, nil
}
