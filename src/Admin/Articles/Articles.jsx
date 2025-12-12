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
  Heart,
  Share2,
  MoreVertical,
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
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import ArticleModal from "./ArticleModal";
import DeleteModal from "../DeleteModal";
import CreateCategoryModal from "../CreateCategoryModal";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";
import StatCardGrid from "../Components/StatCardGrid";
import CategoryDropdownCustom from "../Components/CategoryDropdownCustom";

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [likedArticles, setLikedArticles] = useState(new Set());

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
    return matchesTab && matchesSearch;
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
    // Find first valid category (skip "all")
    const validCategory = categories.find(c => c.id !== "all");
    setFormData({
      title: "",
      category_id: validCategory ? validCategory.id : "",
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

  const handleToggleLike = (articleId) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
  };

  const handleShare = (article) => {
    const text = `Check out: ${article.title}\n${article.excerpt || article.content.substring(0, 100)}...`;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: text,
        url: window.location.href,
      });
    } else {
      alert("Share: " + text);
    }
  };

  if (isLoading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner message="Loading articles..." />
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
    <div className="space-y-6 max-w-10xl mx-auto">
      <PageHeader
        title="Articles Management"
        subtitle="Create and manage Islamic knowledge articles"
      >
        <ModalButton
          onClick={handleOpenAddModal}
          label="Add Article"
          size="md"
        />
        <button
          onClick={() => setShowCategoryModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold text-sm"
        >
          <Tag className="w-4 h-4" />
          Add Category
        </button>
      </PageHeader>

      <StatCardGrid stats={statsData} />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Article List</h3>
        
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
          <CategoryDropdownCustom
            categories={categories.map((cat) => ({
              id: cat.name,
              label: cat.name,
            }))}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            placeholder="Select Article Category"
          />
        </div>

        {filteredArticles.length > 0 ? (
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
                        {article.author || "Unknown"} •{" "}
                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === article.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                        <button
                          onClick={() => {
                            handleToggleFeatured(article.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b"
                        >
                          <Star className={`w-4 h-4 ${article.featured ? "fill-yellow-500 text-yellow-600" : ""}`} />
                          {article.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          onClick={() => {
                            handleOpenEditModal(article);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            confirmDeleteArticle(article.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
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

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg opacity-50"
                    title="Admin cannot like articles"
                  >
                    <Heart className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-500">
                      {article.favorite_count || 0} Likes
                    </span>
                  </div>

                  <button
                    onClick={() => handleShare(article)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </button>

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">
                      {article.view_count?.toLocaleString() || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">
                      {article.comment_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
            >
              Create Article
            </button>
          </div>
        )}
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
