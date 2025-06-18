import React, { useEffect, useState } from 'react';
import { getTopProducts } from '../api/dashboard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList
} from 'recharts';
import { useSnackbar } from "notistack";
import { FaShoppingBasket } from "react-icons/fa";

export default function TopProductsChart() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getTopProducts().then(res => {
      const sorted = res.data.sort((a, b) => b.total_quantity_sold - a.total_quantity_sold);
      setData(sorted);
      enqueueSnackbar("Top Purchased Products fetched successfully!", {
        variant: "success",
        preventDuplicate: true,
      });
    }).catch(err => {
      console.error("Error fetching top products data:", err);
      enqueueSnackbar("Failed to fetch Top Purchased Products.", {
        variant: "error",
        preventDuplicate: true,
      });
    });
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border p-4 rounded-xl shadow-lg animate-fade-in">
          <p className="font-bold text-indigo-700 flex items-center gap-2">
            <FaShoppingBasket className="text-indigo-500" /> {data.product_name}
          </p>
          <p className="mt-2">
            <span className="font-semibold">💯 Total Quantity Sold:</span> {data.total_quantity_sold}
          </p>
          <p>
            <span className="font-semibold">✅ Stock Available:</span> {data.stock_quantity}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl mt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaShoppingBasket className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">Top Purchased Products</h2>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" />
          <XAxis type="number" tick={{ fontSize: 14, fill: "#6366f1" }} />
          <YAxis
            dataKey="product_name"
            type="category"
            width={160}
            tick={{ fontSize: 14, fill: "#6366f1" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total_quantity_sold" fill="#6366f1" barSize={20} radius={[0, 8, 8, 0]}>
            <LabelList
              dataKey="total_quantity_sold"
              position="right"
              fill="#6366f1"
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
