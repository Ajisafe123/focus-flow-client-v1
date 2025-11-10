import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Star,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Tag,
} from "lucide-react";

const ArticlesInterface = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["Aqeedah", "Fiqh", "Tafsir", "Hadith", "Seerah"];

  const [articles] = useState([
    {
      id: 1,
      title: "Understanding Tawheed: The Foundation of Faith",
      category: "Aqeedah",
      author: "Sheikh Ahmed",
      status: "published",
      views: 12450,
      comments: 89,
      date: "2024-10-15",
      featured: true,
    },
    {
      id: 2,
      title: "The Fiqh of Salah: Complete Guide",
      category: "Fiqh",
      author: "Dr. Fatima",
      status: "published",
      views: 10230,
      comments: 67,
      date: "2024-10-20",
      featured: false,
    },
    {
      id: 3,
      title: "The Importance of Patience in Islam",
      category: "Akhlaq",
      author: "Sheikh Ahmed",
      status: "draft",
      views: 0,
      comments: 0,
      date: "2024-10-28",
      featured: false,
    },
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && article.status === "published") ||
      (activeTab === "drafts" && article.status === "draft") ||
      (activeTab === "featured" && article.featured);
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => a.status === "published"
  ).length;
  const draftsCount = articles.filter((a) => a.status === "draft").length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);

  const stats = [
    { icon: BookOpen, title: "Total Articles", value: totalArticles },
    { icon: CheckCircle, title: "Published", value: publishedCount },
    { icon: Edit, title: "Drafts", value: draftsCount },
    {
      icon: TrendingUp,
      title: "Total Views",
      value: `${(totalViews / 1000).toFixed(1)}k`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <BookOpen className="w-7 h-7 sm:w-9 sm:h-9" />
              Articles Management
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base">
              Create and manage Islamic knowledge articles
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg">
            <Plus className="w-5 h-5" />
            Add Article
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Article List
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All", count: articles.length },
                { id: "published", label: "Published", count: publishedCount },
                { id: "drafts", label: "Drafts", count: draftsCount },
                {
                  id: "featured",
                  label: "Featured",
                  count: articles.filter((a) => a.featured).length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 font-semibold transition-all duration-200 whitespace-nowrap rounded-lg text-sm ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {article.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {article.author} •{" "}
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                    <Tag className="w-3 h-3" /> {article.category}
                  </span>
                  {article.status === "published" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                      <CheckCircle className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                      <Clock className="w-3 h-3" /> Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />{" "}
                    {article.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> {article.comments}
                  </span>
                </div>
              </div>
            ))}

            {filteredArticles.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your filters or create a new article
                </p>
              </div>
            )}
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
                <Edit className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                Review Drafts ({draftsCount})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group">
              <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <Eye className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Preview Published</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesInterface;