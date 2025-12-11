import React, { useState, useEffect, useCallback } from "react";
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
  XCircle,
} from "lucide-react";
import {
  fetchArticles,
  fetchArticleCategories,
  fetchArticleStats,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticleFeatured,
  API_BASE,
  DEFAULT_LIMIT,
} from "../apiService";
import LoadingSpinner from "../../Common/LoadingSpinner";
import ArticleModal from "./ArticleModal";
import DeleteModal from "../DeleteModal";
import CreateCategoryModal from "../CreateCategoryModal";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    content: "",
    excerpt: "",
    author: "",
    featured: false,
    status: "draft",
  });

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [articlesData, categoriesData, statsData] = await Promise.all([
        fetchArticles(currentPage, DEFAULT_LIMIT, searchQuery, selectedCategory === "all" ? null : selectedCategory, activeTab === "featured" ? true : null),
        fetchArticleCategories(),
        fetchArticleStats(),
      ]);

      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setCategories(categoriesData || []);
      setStats(statsData);

      // Calculate pagination (if API doesn't return it)
      if (Array.isArray(articlesData)) {
        setTotalItems(articlesData.length);
        setTotalPages(Math.ceil(articlesData.length / DEFAULT_LIMIT));
      }
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(err.message);
      setArticles([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, activeTab]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredArticles = articles.filter((article) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && article.status === "published") ||
      (activeTab === "drafts" && article.status === "draft") ||
      (activeTab === "featured" && article.featured);
    const matchesSearch =
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category_id === selectedCategory;
    return matchesTab && matchesSearch && matchesCategory;
  });

  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftsCount = articles.filter((a) => a.status === "draft").length;
  const featuredCount = articles.filter((a) => a.featured).length;
  const totalViews = articles.reduce((sum, a) => sum + (a.view_count || 0), 0);

  const statsData = stats
    ? [
      { icon: BookOpen, title: "Total Articles", value: stats.total_articles || totalArticles },
      { icon: CheckCircle, title: "Published", value: stats.total_articles || publishedCount },
      { icon: Edit, title: "Drafts", value: draftsCount },
      {
        icon: TrendingUp,
        title: "Total Views",
        value: `${((stats.total_views || totalViews) / 1000).toFixed(1)}k`,
      },
    ]
    : [
      { icon: BookOpen, title: "Total Articles", value: totalArticles },
      { icon: CheckCircle, title: "Published", value: publishedCount },
      { icon: Edit, title: "Drafts", value: draftsCount },
      {
        icon: TrendingUp,
        title: "Total Views",
        value: `${(totalViews / 1000).toFixed(1)}k`,
      },
    ];

  const handleOpenAddModal = () => {
    setIsEdit(false);
    setCurrentArticle(null);
    setFormData({
      title: "",
      category_id: categories.length > 0 ? categories[0].id : "",
      content: "",
      excerpt: "",
      author: "",
      featured: false,
      status: "draft",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (article) => {
    setIsEdit(true);
    setCurrentArticle(article);
    setFormData({
      title: article.title || "",
      category_id: article.category_id || "",
      content: article.content || "",
      excerpt: article.excerpt || "",
      author: article.author || "",
      featured: article.featured || false,
      status: article.status || "draft",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setCurrentArticle(null);
  };

  const handleSaveArticle = async () => {
    try {
      if (isEdit && currentArticle) {
        await updateArticle(currentArticle.id, formData);
      } else {
        await createArticle(formData);
      }
      handleCloseModal();
      fetchAllData();
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Failed to save article: " + err.message);
    }
  };

  const confirmDeleteArticle = (id) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const executeDeleteArticle = async () => {
    if (!deleteTargetId) return;

    const id = deleteTargetId;
    setShowDeleteConfirm(false);
    setIsLoading(true);

    try {
      await deleteArticle(id);
      setDeleteTargetId(null);
      fetchAllData();
    } catch (err) {
      console.error("Error deleting article:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatured = async (articleId) => {
    try {
      await toggleArticleFeatured(articleId);
      fetchAllData();
    } catch (err) {
      console.error("Failed to toggle featured:", err);
      alert("Failed to toggle featured status: " + err.message);
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" message="Loading articles..." />
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="p-12 text-center">
        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error Loading Articles
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-10xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
              Articles Management
            </h1>
            <p className="text-emerald-50 text-xs sm:text-sm md:text-base">
              Create and manage Islamic knowledge articles
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Add Article
          </button>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
            Manage Categories
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
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
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[
                { id: "all", label: "All", count: totalArticles },
                { id: "published", label: "Published", count: publishedCount },
                { id: "drafts", label: "Drafts", count: draftsCount },
                { id: "featured", label: "Featured", count: featuredCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 font-semibold transition-all duration-200 whitespace-nowrap rounded-lg text-sm ${activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id
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
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
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
                          {article.author || "Unknown"} •{" "}
                          {article.created_at
                            ? new Date(article.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(article.id)}
                        className={`p-2 rounded-lg transition-colors ${article.featured
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-gray-600 hover:bg-gray-50"
                          }`}
                        title={article.featured ? "Unfeature" : "Feature"}
                      >
                        <Star
                          className={`w-4 h-4 ${article.featured ? "fill-yellow-500" : ""
                            }`}
                        />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteArticle(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.category && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full">
                        <Tag className="w-3 h-3" /> {article.category.name || article.category}
                      </span>
                    )}
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
                      {article.view_count?.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />{" "}
                      {article.comment_count || 0}
                    </span>
                  </div>
                </div>
              ))
            ) : (
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
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create Article
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 md:p-6 border border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">
            Quick Actions
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleOpenAddModal}
              className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-1 sm:p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm">Add New Article</span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setActiveTab("drafts")}
              className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-1 sm:p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm">
                Review Drafts ({draftsCount})
              </span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setActiveTab("published")}
              className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
            >
              <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="font-semibold text-xs sm:text-sm">Preview Published</span>
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <ArticleModal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveArticle}
        title={isEdit ? "Edit Article" : "Add New Article"}
        isEdit={isEdit}
        categories={categories}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteModal
        show={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
        onDelete={executeDeleteArticle}
        itemType="Article"
        itemTitle={
          articles.find((a) => a.id === deleteTargetId)?.title || "this Article"
        }
      />

      <CreateCategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={() => {
          fetchAllData();
          setShowCategoryModal(false);
        }}
        categories={categories}
        fetchCategories={fetchArticleCategories}
        categoryType="article"
      />
    </div>
  );
};

export default Articles;
