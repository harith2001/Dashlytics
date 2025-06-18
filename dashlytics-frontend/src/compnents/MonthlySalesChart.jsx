import React, { useEffect, useState } from "react";
import { getMonthlySales } from "../api/dashboard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSnackbar } from "notistack";
import { FaChartLine, FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function MonthlySalesChart() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [sortField, setSortField] = useState("month");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    getMonthlySales(sortField, sortOrder)
      .then((res) => {
        setData(res.data);
        enqueueSnackbar("Monthly Sales Volume fetched successfully!", {
          variant: "success",
          preventDuplicate: true,
        });
      })
      .catch((err) => {
        console.error("Error fetching monthly sales data:", err);
        enqueueSnackbar("Failed to fetch Monthly Sales Volume.", {
          variant: "error",
          preventDuplicate: true,
        });
      });
  }, [sortField, sortOrder]);

  function formatAbbreviatedNumber(num) {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num}`;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { total_quantity_sold, total_revenue } = payload[0].payload;
      return (
        <div className="bg-white border p-4 rounded-xl shadow-lg text-base animate-fade-in">
          <p className="font-bold text-indigo-700 flex items-center gap-2">
            <FaChartLine className="text-indigo-500" /> {label}
          </p>
          <p className="mt-2">
            📦 <span className="font-semibold">{total_quantity_sold}</span>{" "}
            Items Sold
          </p>
          <p>
            💰{" "}
            <span className="font-semibold text-green-600">
              ${total_revenue.toFixed(2)}
            </span>{" "}
            Revenue
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl mt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaChartLine className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
          Monthly Sales Volume
        </h2>
        <label className="flex items-center gap-2 text-sm">
          Sort by:
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="month">Month</option>
            <option value="sales">Sales</option>
          </select>
          <span className="text-gray-500">
            {sortOrder === "asc" ? (
              <FaArrowUp className="inline" />
            ) : (
              <FaArrowDown className="inline" />
            )}
          </span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 40, bottom: 30, left: 20 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" />
          <XAxis dataKey="month" tick={{ fontSize: 14, fill: "#6366f1" }} />
          <YAxis
            yAxisId="left"
            label={{
              value: "Items Sold",
              angle: -90,
              position: "insideLeft",
              fill: "#10b981",
            }}
            tick={{ fontSize: 14, fill: "#10b981" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Revenue ($)",
              angle: -90,
              position: "insideRight",
              fill: "#3b82f6",
            }}
            tick={{ fontSize: 14, fill: "#3b82f6" }}
            tickFormatter={formatAbbreviatedNumber}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" iconType="circle" height={36} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="total_quantity_sold"
            name="Items Sold"
            stroke="#10b981"
            strokeWidth={4}
            dot={{
              r: 7,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#10b981",
              filter: "drop-shadow(0 2px 6px #10b98133)",
            }}
            activeDot={{ r: 10 }}
            isAnimationActive={true}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="total_revenue"
            name="Revenue ($)"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{
              r: 7,
              stroke: "#fff",
              strokeWidth: 2,
              fill: "#3b82f6",
              filter: "drop-shadow(0 2px 6px #3b82f633)",
            }}
            activeDot={{ r: 10 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
