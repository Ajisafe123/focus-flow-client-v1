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
import StatCard from "./StatCard";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Overview
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your platform performance
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Last 30 Days</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-white rounded-lg hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="4,234"
          icon={Users}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Total Articles"
          value="102"
          icon={BookOpen}
          trend="up"
          trendValue="+8.3%"
        />
        <StatCard
          title="Total Duas"
          value="290"
          icon={Heart}
          trend="up"
          trendValue="+15.2%"
        />
        <StatCard
          title="Engagement Rate"
          value="87%"
          icon={TrendingUp}
          trend="up"
          trendValue="+4.1%"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Growth Trends
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              User acquisition and content growth over time
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-lg">
              Users
            </button>
            <button className="px-3 py-1 text-sm hover:bg-gray-50 text-gray-600 rounded-lg">
              Articles
            </button>
            <button className="px-3 py-1 text-sm hover:bg-gray-50 text-gray-600 rounded-lg">
              Duas
            </button>
          </div>
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
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Weekly Engagement
          </h3>
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

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Content by Category
          </h3>
          <div className="flex items-center justify-center">
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
          </div>
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

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Content
          </h3>
          <button className="flex items-center gap-2 text-sm text-emerald-900 hover:text-emerald-700">
            View All
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
        <div className="space-y-4">
          {topContent.map((content, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  rounded-lg text-white font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {content.title}
                </h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {content.views.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {content.engagement}% engagement
                  </span>
                </div>
              </div>
              <div className="w-24 hidden sm:block">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  h-2 rounded-full"
                    style={{ width: `${content.engagement}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-900" />
            </div>
            <h4 className="font-semibold text-gray-900">
              Avg. Session Duration
            </h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">8m 42s</p>
          <p className="text-sm text-gray-600 mt-2">+1m 15s from last month</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-50 rounded-lg">
              <Users className="w-5 h-5 text-teal-900" />
            </div>
            <h4 className="font-semibold text-gray-900">Active Users Now</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">248</p>
          <p className="text-sm text-gray-600 mt-2">Across 12 countries</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-gray-900">User Satisfaction</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">4.8/5</p>
          <p className="text-sm text-gray-600 mt-2">Based on 1,234 reviews</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
