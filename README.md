# 📊 Dashlytics

**Dashlytics** is a high-performance analytics dashboard built using **Go** (backend) and **React + Vite + Recharts** (frontend), designed to analyze and visualize large-scale CSV transaction data efficiently.

---

## 🚀 Technology Stack

### 📦 Backend
- **Language:** Go 1.21+
- **Framework:** Chi (router)
- **CSV Parser:** encoding/csv
- **Documentation:** Swagger (via swaggo)

### 🎨 Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **HTTP:** Axios
- **State Management:** useState/useEffect
- **Notifications:** notistack

---

## 🧠 Features

- Fast in-memory CSV ingestion and indexing
- Real-time analytics: country revenue, product ranking, monthly trends, regional sales
- Interactive charts and tables with filtering, sorting, and tooltips
- Fully documented REST API with Swagger UI
- Responsive UI with modern design (Tailwind + Recharts)

---

## 🛠️ Setup Instructions

### ✅ Docker (Optional)

If you have Docker installed, you can start the entire application using:

```bash
docker-compose up --build
```

This will build and launch both the backend and frontend services automatically.

### ✅ Backend

1. Clone the repo and navigate to backend root:
   ```bash
   git clone https://github.com/your_username/Dashlytics.git
   cd Dashlytics
2. Install dependencies:
   ```bash
   go mod tidy
3. Generate Swagger docs:
   ```bash
    swag init --generalInfo cmd/server/main.go --output docs
4. Run the server:
    ```bash
    go run cmd/server/main.go
5. Access API Docs:
    ```bash
    http://localhost:8080/swagger/index.html

### ✅ Frontend

1. Go to frontend:
   ```bash
   cd dashlytics-frontend
2. Install dependencies:
   ```bash
   npm install
3. Start dev server:
   ```bash
    npm run dev
4. Run the server:
    ```bash
    go run cmd/server/main.go
5. Open in browser:
    ```ardunio
    http://localhost:5173

### 🌐 API Endpoints (Swagger Available)

| Endpoint              | Method | Description                        | Query Params      |
|-----------------------|--------|------------------------------------|-------------------|
| /api/country-revenue  | GET    | Revenue per product per country    | `?limit=50`       |
| /api/top-products     | GET    | Top 20 products by quantity        |                   |
| /api/monthly-sales    | GET    | Sales per month                    | `?sort=sales`     |
| /api/top-regions      | GET    | Top 30 regions by revenue          |                   |

✅ Fully documented in Swagger UI

### 🧪 Backend Unit Testing 

**Test files:**  
`internal/adapter/handlers_test.go`

**Run all tests:**
```bash
go test ./internal/adapter/...
```

**Tests cover:**
- `/api/country-revenue`
- `/api/top-products`
- `/api/top-regions`

✅ Uses `httptest`, mock transactions, and response assertions.

## 📁 Sample CSV Format

Your CSV file **must include the following columns** (header row):

```
ID,Date,Country,Region,ProductName,Quantity,TotalPrice,Stock
```

**Sample record:**

```
TX001,2024-04-01,USA,California,Widget A,2,49.99,200
```

✅ The backend indexes: `Country`, `Region`, `ProductName`, `Date`, `Quantity`, `TotalPrice`, `Stock`.

## 💡 Project Highlights

- **In-memory only:** No database required
- **High performance:** Handles 5M+ rows efficiently
- **Custom indexing:** Sorted and grouped data for fast queries
- **Well-tested:** Unit-tested handlers and modular codebase
- **Rich frontend:** Filters, dynamic tooltips, dual Y-axes, and sort dropdowns

## 🧑‍💻 Author

**Harith Danula Vithanage**  
GitHub: [@harith2001](https://github.com/harith2001)

---

## 📜 License

**MIT License**  
Use freely for demos, learning, or assignments. Credit is appreciated.

---

## 📸 Screenshots

![Dashlytics 1st Page](/img/UI.png)
![Dashlytics Dashboard](/img//dashboard.png)
![Dashlytics Dashboard](/img//dashboard1.png)
![Dashlytics Dashboard](/img//dashboard2.png)
![Dashlytics Dashboard](/img//dashboard3.png)
