import React from "react";
import CountryRevenueTable from "../compnents/CountryRevenueTable";
import TopProductsChart from "../compnents/TopProductsChart";
import MonthlySalesChart from "../compnents/MonthlySalesChart";
import TopRegionsChart from "../compnents/TopRegionsChart";
import { SnackbarProvider } from "notistack";

export default function Dashboard() {
  return (
    <>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Navbar */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
            <span className="text-3xl font-extrabold text-indigo-900 tracking-tight">
              DASHLYTICS
            </span>
            <div className="ml-auto flex gap-6">
              <a
                href="#country-revenue"
                className="text-indigo-700 hover:text-indigo-900 font-medium transition"
              >
                Country Revenue
              </a>
              <a
                href="#top-products"
                className="text-indigo-700 hover:text-indigo-900 font-medium transition"
              >
                Top Products
              </a>
              <a
                href="#monthly-sales"
                className="text-indigo-700 hover:text-indigo-900 font-medium transition"
              >
                Monthly Sales
              </a>
              <a
                href="#top-regions"
                className="text-indigo-700 hover:text-indigo-900 font-medium transition"
              >
                Top Regions
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 p-6">
          <section id="country-revenue" className="scroll-mt-20">
            <CountryRevenueTable />
          </section>
          <section id="top-products" className="scroll-mt-20">
            <TopProductsChart />
          </section>
          <section id="monthly-sales" className="scroll-mt-20">
            <MonthlySalesChart />
          </section>
          <section id="top-regions" className="scroll-mt-20">
            <TopRegionsChart />
          </section>
        </div>
      </SnackbarProvider>
    </>
  );
}
