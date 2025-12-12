import React from "react";
import { TrendingUp } from "lucide-react";

const StatCardGrid = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-emerald-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-110">
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            {stat.trend && (
              <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{stat.trendValue}</span>
              </div>
            )}
          </div>
          <h3 className="text-gray-500 text-xs sm:text-sm font-semibold mb-2 uppercase tracking-wider">
            {stat.title}
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatCardGrid;
