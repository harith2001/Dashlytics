import React, { useEffect, useState } from "react";
import { getTopRegions } from "../api/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Legend,
} from "recharts";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useSnackbar } from "notistack";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { total_revenue, total_items_sold } = payload[0].payload;
    return (
      <div className="bg-white border p-4 rounded-xl shadow-lg animate-fade-in">
        <p className="font-bold text-indigo-700 flex items-center gap-2">
          <FaMapMarkedAlt className="text-indigo-500" /> {label}
        </p>
        <p className="mt-2">
          <span className="font-semibold">💰 Revenue:</span> $
          {total_revenue.toLocaleString()}
        </p>
        <p>
          <span className="font-semibold">📦 Items Sold:</span>{" "}
          {total_items_sold}
        </p>
      </div>
    );
  }
  return null;
};

export default function TopRegionsChart() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getTopRegions(limit)
      .then((res) => {
        const sorted = res.data.sort(
          (a, b) => b.total_revenue - a.total_revenue
        );
        setData(sorted);
        enqueueSnackbar("Top Regions Revenue successfully!", {
          variant: "success",
          preventDuplicate: true,
        });
      })
      .catch((err) => {
        console.error("Error fetching top regions data:", err);
        enqueueSnackbar("Failed to fetch top regions data.", {
          variant: "error",
          preventDuplicate: true,
        });
      });
  }, [limit]);

  function formatAbbreviatedNumber(num) {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    return `$${num.toLocaleString()}`;
  }

  return (
    <div className="p-8 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-2xl mt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaMapMarkedAlt className="text-3xl text-indigo-600" />
        <h2 className="text-2xl font-extrabold text-indigo-900 tracking-tight">
          Top 30 Regions by Revenue
        </h2>
        <label className="ml-auto flex items-center gap-2 text-sm">
          Show:
          <div className="flex gap-2">
            {[5, 10, 20, 30].map((opt) => (
              <button
                key={opt}
                onClick={() => setLimit(opt)}
                className={`px-3 py-1 rounded ${
                  limit === opt
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-700"
                } transition`}
              >
                {opt}
              </button>
            ))}
          </div>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" />
          <XAxis
            dataKey="region"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={120}
            tick={{ fontSize: 14, fill: "#6366f1" }}
          />
          <YAxis
            tick={{ fontSize: 14, fill: "#3b82f6" }}
            tickFormatter={formatAbbreviatedNumber}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" iconType="circle" height={36} />
          <Bar
            dataKey="total_revenue"
            name="Revenue ($)"
            fill="#3b82f6"
            barSize={28}
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          >
            <LabelList
              dataKey="total_revenue"
              position="top"
              formatter={formatAbbreviatedNumber}
              fill="#3b82f6"
              fontWeight="bold"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
