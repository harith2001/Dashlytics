package main

import (
	"fmt"
	"log"

	"Dashlytics/internal/repository"
)

func main() {
	csvFilePath := "../../data/GO_test_5m.csv"
	transactions, err := repository.LoadCSV(csvFilePath)
	if err != nil {
		log.Fatalf("Error loading CSV file: %v", err)
	}
	fmt.Printf("Loaded %d transactions\n Sample: %+v\n", len(transactions), transactions[0])
}
