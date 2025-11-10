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
      title: "Hadith",
      value: "1,856",
      icon: MessageSquare,
      trend: "up",
      trendValue: "+15%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Assalamu Alaikum, Admin 👋
          </h1>
          <p className="text-emerald-50 text-sm sm:text-base md:text-lg">
            Welcome back to Nibras Al-Deen Dashboard
          </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 transition-colors">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-sm flex-shrink-0">
                  {activity.type === "article" && (
                    <BookOpen className="w-4 h-4 text-white" />
                  )}
                  {activity.type === "dua" && (
                    <Heart className="w-4 h-4 text-white" />
                  )}
                  {activity.type === "user" && (
                    <Users className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.item}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group">
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Add New Article</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group">
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Add New Dua</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group">
              <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <Eye className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">View Site</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
