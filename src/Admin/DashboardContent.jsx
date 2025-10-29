import React from "react";
import {
  BookOpen,
  Heart,
  Users,
  MessageSquare,
  Plus,
  Eye,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import StatCard from "./StatCard";

const DashboardContent = () => {
  const recentActivity = [
    {
      action: "New article published",
      item: "The Importance of Patience",
      time: "2 hours ago",
      type: "article",
    },
    {
      action: "Dua added",
      item: "Morning Adhkar",
      time: "4 hours ago",
      type: "dua",
    },
    {
      action: "User registered",
      item: "Ahmed Hassan",
      time: "5 hours ago",
      type: "user",
    },
    {
      action: "Comment approved",
      item: 'On "Fiqh of Salah"',
      time: "6 hours ago",
      type: "comment",
    },
  ];

  const stats = [
    {
      title: "Total Articles",
      value: "102",
      icon: BookOpen,
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Total Duas",
      value: "290",
      icon: Heart,
      trend: "up",
      trendValue: "+8%",
    },
    {
      title: "Total Users",
      value: "4,234",
      icon: Users,
      trend: "up",
      trendValue: "+23%",
    },
    {
      title: "Comments",
      value: "1,856",
      icon: MessageSquare,
      trend: "up",
      trendValue: "+15%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-8 text-white shadow-xl border border-emerald-700/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">
            Assalamu Alaikum, Admin 👋
          </h1>
          <p className="text-emerald-200 text-lg">
            Welcome back to Nibras Al-Deen Dashboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-xl shadow-md">
                <stat.icon className="w-6 h-6 text-amber-300" />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stat.trendValue}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1 uppercase tracking-wide">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition-colors">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 border border-transparent hover:border-emerald-100 group"
              >
                <div className="p-2.5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                  {activity.type === "article" && (
                    <BookOpen className="w-4 h-4 text-amber-300" />
                  )}
                  {activity.type === "dua" && (
                    <Heart className="w-4 h-4 text-amber-300" />
                  )}
                  {activity.type === "user" && (
                    <Users className="w-4 h-4 text-amber-300" />
                  )}
                  {activity.type === "comment" && (
                    <MessageSquare className="w-4 h-4 text-amber-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {activity.item}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group border border-emerald-700/30">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-semibold">Add New Article</span>
              <ArrowUpRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
              <span className="font-semibold">Add New Dua</span>
              <ArrowUpRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="w-full flex items-center gap-3 p-4 border-2 border-emerald-200 bg-emerald-50 text-emerald-800 rounded-xl hover:scale-105 hover:border-emerald-300 hover:bg-emerald-100 transition-all duration-200 group shadow-sm">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-semibold">View Site</span>
              <ArrowUpRight className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
