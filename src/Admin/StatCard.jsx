import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-xl shadow-md">
        <Icon className="w-6 h-6 text-amber-300" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          <TrendingUp
            className={`w-4 h-4 ${trend === "down" ? "rotate-180" : ""}`}
          />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">
      {title}
    </h3>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export default StatCard;
