import React, { useEffect, useState } from "react";
import { getCountryRevenue } from "../api/dashboard";
import { useSnackbar } from "notistack";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function CountryRevenueTable() {
  const [data, setData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const rowsPerPage = 10;

  useEffect(() => {
    getCountryRevenue(limit)
      .then((response) => {
        setData(response.data);
        enqueueSnackbar("Country revenue data fetched successfully!", {
          variant: "success",
          preventDuplicate: true,
        });
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error fetching country revenue data:", error);
        enqueueSnackbar("Failed to fetch country revenue data.", {
          variant: "error",
          preventDuplicate: true,
        });
      });
  }, [limit]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const paginated = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div className="p-6 bg-white rounded-2xl shadow-lg transition-shadow hover:shadow-2xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
            <span className="inline-block w-2 h-8 bg-indigo-500 rounded-full mr-2"></span>
            Country Level Revenue
          </h2>
          <label className="flex items-center gap-2 text-sm">
            Records to load:
            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value) || 1)}
              className="border border-indigo-300 rounded-lg px-3 py-1 w-24 focus:ring-2 focus:ring-indigo-200 transition"
            />
          </label>
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-base border-separate border-spacing-y-2">
            <thead className="bg-indigo-50 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-center font-semibold text-indigo-700">
                  Country
                </th>
                <th className="p-3 text-center font-semibold text-indigo-700">
                  Product
                </th>
                <th className="p-3 text-center font-semibold text-indigo-700">
                  Revenue ($)
                </th>
                <th className="p-3 text-center font-semibold text-indigo-700">
                  Transactions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition hover:bg-indigo-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 text-center flex items-center gap-2 justify-center">
                    {/* Example: <img src={getFlagUrl(row.country)} alt="" className="w-5 h-5 rounded-full" /> */}
                    {row.country}
                  </td>
                  <td className="p-3 text-center">{row.product_name}</td>
                  <td className="p-3 text-center font-mono font-semibold text-green-700">
                    {row.total_revenue.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">{row.transaction_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
           <MdChevronLeft />
            Prev
          </button>
          <span className="text-base font-medium text-indigo-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 rounded-full bg-indigo-100 hover:bg-indigo-200 transition disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <MdChevronRight  />
            Next
          </button>
        </div>
      </div>
    </>
  );
}
