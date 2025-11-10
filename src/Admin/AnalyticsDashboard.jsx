import React from "react";
import {
  Users,
  BookOpen,
  Heart,
  TrendingUp,
  Calendar,
  Download,
  ChevronDown,
  Eye,
  Clock,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsDashboard = () => {
  const trafficData = [
    { month: "Jan", users: 1200, articles: 45, duas: 120 },
    { month: "Feb", users: 1900, articles: 52, duas: 145 },
    { month: "Mar", users: 2400, articles: 68, duas: 180 },
    { month: "Apr", users: 2800, articles: 75, duas: 210 },
    { month: "May", users: 3500, articles: 89, duas: 250 },
    { month: "Jun", users: 4200, articles: 102, duas: 290 },
  ];

  const categoryData = [
    { name: "Aqeedah", value: 145, color: "#10b981" },
    { name: "Fiqh", value: 230, color: "#14b8a6" },
    { name: "Tafsir", value: 180, color: "#eab308" },
    { name: "Hadith", value: 165, color: "#f59e0b" },
    { name: "Seerah", value: 95, color: "#06b6d4" },
  ];

  const engagementData = [
    { day: "Mon", views: 3200, comments: 45, shares: 23 },
    { day: "Tue", views: 4100, comments: 62, shares: 31 },
    { day: "Wed", views: 3800, comments: 55, shares: 28 },
    { day: "Thu", views: 5200, comments: 78, shares: 42 },
    { day: "Fri", views: 6800, comments: 95, shares: 58 },
    { day: "Sat", views: 5500, comments: 72, shares: 45 },
    { day: "Sun", views: 4900, comments: 68, shares: 38 },
  ];

  const topContent = [
    { title: "Understanding Tawheed", views: 12450, engagement: 94 },
    { title: "Fiqh of Salah", views: 10230, engagement: 89 },
    { title: "Stories of the Prophets", views: 9850, engagement: 92 },
    { title: "Ramadan Guide", views: 8920, engagement: 96 },
    { title: "Du'a Etiquette", views: 8150, engagement: 88 },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "4,234",
      icon: Users,
      trend: "up",
      trendValue: "+12.5%",
    },
    {
      title: "Total Articles",
      value: "102",
      icon: BookOpen,
      trend: "up",
      trendValue: "+8.3%",
    },
    {
      title: "Total Duas",
      value: "290",
      icon: Heart,
      trend: "up",
      trendValue: "+15.2%",
    },
    {
      title: "Engagement Rate",
      value: "87%",
      icon: TrendingUp,
      trend: "up",
      trendValue: "+4.1%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Analytics Overview
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base md:text-lg">
              Comprehensive insights into your platform performance
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">Last 30 Days</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg hover:shadow-md transition-all duration-200 font-semibold">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.trendValue}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
              {stat.title}
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Growth Trends</h3>
            <p className="text-sm text-gray-600 mt-1">
              User acquisition and content growth over time
            </p>
          </div>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors">
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="users"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Weekly Engagement
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="views" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="comments" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="shares" fill="#eab308" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">
              Content by Category
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                ></div>
                <span className="text-sm text-gray-700">{cat.name}</span>
                <span className="text-sm font-semibold text-gray-900 ml-auto">
                  {cat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            Top Performing Content
          </h3>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {topContent.map((content, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg text-white font-bold shadow-sm flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {content.title}
                </h4>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {content.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {content.engagement}%
                  </span>
                </div>
              </div>
              <div className="hidden sm:block w-24">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-br from-emerald-500 to-green-600 h-2 rounded-full"
                    style={{ width: `${content.engagement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
            Avg. Session Duration
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            8m 42s
          </p>
          <p className="text-xs text-gray-600">+1m 15s from last month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
            Active Users Now
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            248
          </p>
          <p className="text-xs text-gray-600">Across 12 countries</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all duration-200 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
            User Satisfaction
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            4.8/5
          </p>
          <p className="text-xs text-gray-600">Based on 1,234 reviews</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
