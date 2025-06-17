import React, { useEffect, useState } from 'react';
import { getCountryRevenue } from "../api/dashboard";
import { useSnackbar } from "notistack";

export default function CountryRevenueTable() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getCountryRevenue()
      .then((response) => {
        setData(response.data);
        enqueueSnackbar("Country revenue data fetched successfully!", {
          variant: "success",
          preventDuplicate: true,
        });
      })
      .catch((error) => {
        console.error("Error fetching country revenue data:", error);
        enqueueSnackbar("Failed to fetch country revenue data.", {
          variant: "error",
          preventDuplicate: true,
        });
      });
  }, []);

  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Country-Level Revenue</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Country</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-right">Revenue ($)</th>
              <th className="p-2 text-right">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{row.country}</td>
                <td className="p-2">{row.product_name}</td>
                <td className="p-2 text-right">
                  {row.total_revenue.toFixed(2)}
                </td>
                <td className="p-2 text-right">{row.transaction_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
