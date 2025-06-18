import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function LandingPage() {
  const navigate = useNavigate();
  const text =
    "Dashlytics handles large amounts of spreadsheet data, providing intuitive analytics and insightful dashboards for your business.";
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < words.length) {
      const timeout = setTimeout(() => {
        setVisibleCount(visibleCount + 1);
      }, 120); 
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, words.length]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-gray-100 p-6">
      <h1 className="text-5xl font-extrabold text-center mb-6 tracking-tight text-indigo-900 drop-shadow-lg">
        DASHLYTICS
      </h1>
      <p className="text-xl text-center max-w-2xl mx-auto mb-10 text-gray-700">
        {words.slice(0, visibleCount).join(" ")}
        <span className="inline-block w-2 animate-pulse">{visibleCount < words.length ? "|" : ""}</span>
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-8 py-3 bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all duration-200"
      >
        Click here
      </button>
    </div>
  );
}
