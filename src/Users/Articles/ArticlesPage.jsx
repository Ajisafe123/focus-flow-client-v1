import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  Clock,
  User,
  Calendar,
  Eye,
  X,
  ArrowLeft,
  Share2,
  Lightbulb,
} from "lucide-react";
import {
  fetchArticlesPaginated,
  fetchArticle,
  toggleArticleFavorite,
  fetchArticleCategories,
  shareArticle,
} from "../Service/apiService";
import LoadingSpinner from "../../Common/LoadingSpinner";

// Default image fallback
const DEFAULT_IMAGE = "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=800";


const ArticleCard = ({
  article,
  onReadMore,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
}) => {
  const isFavorite = isAuthenticated ? article.is_favorite : isLocallyFavorite;

  const handleLike = (e) => {
    e.stopPropagation();
    handleLocalToggle(article.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/article/${article.id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const colors = [
    { bg: "bg-gradient-to-br from-green-50 to-green-100", border: "border-green-300", accent: "text-green-600", tag: "bg-green-100 text-green-700" },
    { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100", border: "border-emerald-300", accent: "text-emerald-600", tag: "bg-emerald-100 text-emerald-700" },
    { bg: "bg-gradient-to-br from-teal-50 to-teal-100", border: "border-teal-300", accent: "text-teal-600", tag: "bg-teal-100 text-teal-700" },
    { bg: "bg-gradient-to-br from-lime-50 to-lime-100", border: "border-lime-300", accent: "text-lime-600", tag: "bg-lime-100 text-lime-700" },
  ];
  
  const colorIndex = article.id.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];

  return (
    <article
      onClick={() => onReadMore(article)}
      className={`group ${color.bg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${color.border} cursor-pointer flex flex-col h-full hover:scale-105`}
    >
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div className="mb-4">
          <h3 className={`text-base font-bold ${color.accent} group-hover:opacity-80 transition-all line-clamp-3 mb-3 leading-snug`}>
            {article.title}
          </h3>
          
          <p className="text-sm text-gray-700 line-clamp-3 mb-4 leading-relaxed font-medium">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 2).map((t, i) => (
              <span
                key={i}
                className={`px-2.5 py-1 ${color.tag} rounded-full text-xs font-bold`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t-2 border-white/50">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full ${color.tag} flex items-center justify-center`}>
                <User className="w-3 h-3" />
              </div>
              <span className="font-bold text-gray-800">{article.author}</span>
            </div>
            <span className={`flex items-center gap-1.5 ${color.tag} px-2.5 py-1 rounded-full font-bold`}>
              <Eye className="w-3 h-3" />
              {article.view_count || article.views || 0}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock className={`w-3 h-3 ${color.accent}`} />
              {article.read_time} min
            </span>
            <span className={`flex items-center gap-1.5 ${color.tag} px-2.5 py-1 rounded-full font-bold`}>
              <Share2 className="w-3 h-3" />
              {article.share_count || 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

const ArticlesPage = ({ categoryId }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { articleId } = useParams();
  const categoryFromUrl = searchParams.get("category");
  const filterType = searchParams.get("filter") || null; // popular, latest, trending
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(categoryId || categoryFromUrl || null);
  const [view, setView] = useState(articleId ? "detail" : "articles");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());
  const [viewedArticles, setViewedArticles] = useState(new Set());
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const userRole = localStorage.getItem("userRole") || "user";


  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchArticlesPaginated(1, 100, searchTerm, selectedCatId || null, null, token);
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(err.message);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCatId, searchTerm, token, filterType]);

  useEffect(() => {
    loadArticles();
  }, [selectedCatId, searchTerm, loadArticles, filterType]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchArticleCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categoryFromUrl && !selectedCatId) {
      setSelectedCatId(categoryFromUrl);
      setView("articles");
    }
  }, [categoryFromUrl, selectedCatId]);

  useEffect(() => {
    if (articleId) {
      readMore({ id: articleId });
    }
  }, [articleId]);

  let filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply filter type sorting
  if (filterType === "popular") {
    // Sort by engagement: likes + shares + views
    filteredArticles = filteredArticles
      .map(a => ({
        ...a,
        engagementScore: (a.favorite_count || 0) + (a.share_count || 0) + (a.view_count || 0)
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .filter(a => a.engagementScore > 0); // Only show articles with engagement
  } else if (filterType === "latest") {
    // Sort by newest first
    filteredArticles = filteredArticles.sort((a, b) => {
      const dateA = new Date(a.created_at || a.published_date || 0).getTime();
      const dateB = new Date(b.created_at || b.published_date || 0).getTime();
      return dateB - dateA;
    });
  } else if (filterType === "trending") {
    // Sort by recent engagement (views + likes + shares in recent articles)
    filteredArticles = filteredArticles
      .map(a => ({
        ...a,
        recentEngagement: (a.favorite_count || 0) * 2 + (a.share_count || 0) * 3 + (a.view_count || 0)
      }))
      .sort((a, b) => b.recentEngagement - a.recentEngagement)
      .filter(a => a.recentEngagement > 0);
  }


  const readMore = async (art) => {
    try {
      const fullArticle = await fetchArticle(art.id, token);
      setSelectedArticle(fullArticle);
      setView("detail");
      
      // Track view only once per user per article
      if (!viewedArticles.has(art.id)) {
        setViewedArticles((prev) => new Set([...prev, art.id]));
      }
    } catch (err) {
      console.error("Failed to load article:", err);
      // Try to find article in loaded articles list
      const foundArticle = articles.find(a => a.id === art.id || a.id.toString() === art.id.toString());
      if (foundArticle) {
        setSelectedArticle(foundArticle);
        setView("detail");
      } else if (art.id) {
        // If article not found in list, still show it with available data
        // This handles cases where API returns 404 but we have the article data
        setSelectedArticle({
          ...art,
          content: art.content || art.excerpt || "Article content not available",
          view_count: art.view_count || art.views || 0,
          favorite_count: art.favorite_count || 0,
          share_count: art.share_count || 0,
        });
        setView("detail");
      }
      
      // Track view only once per user per article
      if (!viewedArticles.has(art.id)) {
        setViewedArticles((prev) => new Set([...prev, art.id]));
      }
    }
  };

  const closeDetail = () => {
    setView("articles");
    setSelectedArticle(null);
  };

  const toggleLocal = (id) => {
    setLocalFavorites((s) => {
      const ns = new Set(s);
      ns.has(id) ? ns.delete(id) : ns.add(id);
      return ns;
    });
  };
  
  const handleToggleFavorite = async (articleId) => {
    if (!isAuthenticated) {
      toggleLocal(articleId);
      return;
    }
    
    try {
      await toggleArticleFavorite(articleId, token);
      // Update selected article if viewing detail
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle((prev) => ({
          ...prev,
          is_favorite: !prev.is_favorite,
          favorite_count: prev.is_favorite ? (prev.favorite_count || 1) - 1 : (prev.favorite_count || 0) + 1,
        }));
      }
      // Refresh articles to get updated favorite status
      loadArticles();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Fallback to local toggle
      toggleLocal(articleId);
    }
  };


  if (view === "detail" && selectedArticle) {
    const isFavorite = isAuthenticated ? selectedArticle.is_favorite : localFavorites.has(selectedArticle.id);
    const likeCount = selectedArticle.favorite_count || 0;
    const shareCount = selectedArticle.share_count || 0;

    const handleDetailLike = (e) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      handleToggleFavorite(selectedArticle.id);
    };

    const handleDetailShare = async (e) => {
      e.stopPropagation();
      const url = `${window.location.origin}/article/${selectedArticle.id}`;
      navigator.clipboard.writeText(url);
      
      // Call API to increment share count
      try {
        await shareArticle(selectedArticle.id, token);
        // Refetch article to get updated share count from backend
        const updatedArticle = await fetchArticle(selectedArticle.id, token);
        setSelectedArticle(updatedArticle);
      } catch (err) {
        console.error("Failed to record share:", err);
        // Still update local state even if API fails
        setSelectedArticle((prev) => ({
          ...prev,
          share_count: (prev.share_count || 0) + 1,
        }));
      }
      alert("Link copied to clipboard!");
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          {/* Back Button */}
          <button
            onClick={closeDetail}
            className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 font-semibold transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>

          {/* Article Header */}
          <article className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 mb-8">
            {/* Title Section */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h1>
              
              {/* Author & Meta Info */}
              <div className="flex flex-wrap items-center gap-6 pb-8 border-b-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">By</p>
                    <p className="text-lg font-bold text-gray-900">{selectedArticle.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">
                    {selectedArticle.published_date 
                      ? new Date(selectedArticle.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : selectedArticle.created_at
                      ? new Date(selectedArticle.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Date not available'
                    }
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">{selectedArticle.read_time} min read</span>
                </div>

                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-gray-700">{selectedArticle.view_count || selectedArticle.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Like & Share Actions */}
            <div className="flex items-center gap-8 mb-10 py-8 border-b-2 border-gray-200">
              {userRole !== "admin" ? (
                <button
                  onClick={handleDetailLike}
                  className="flex items-center gap-3 group transition-all active:scale-95"
                >
                  <Heart
                    className={`w-8 h-8 transition-all flex-shrink-0 ${
                      isFavorite
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-400 group-hover:text-red-500 group-hover:scale-110"
                    }`}
                  />
                  <div className="text-left">
                    <p className={`text-xl font-black transition-colors ${isFavorite ? "text-red-600" : "text-gray-700 group-hover:text-red-600"}`}>
                      {likeCount}
                    </p>
                    <p className={`text-xs font-bold uppercase tracking-wider transition-colors ${isFavorite ? "text-red-600" : "text-gray-500 group-hover:text-red-600"}`}>
                      {likeCount === 1 ? "Like" : "Likes"}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3 opacity-60">
                  <Heart className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xl font-black text-gray-600">
                      {likeCount}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      {likeCount === 1 ? "Like" : "Likes"}
                    </p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleDetailShare}
                className="flex items-center gap-3 group transition-all active:scale-95"
              >
                <Share2 className="w-8 h-8 text-gray-400 group-hover:text-emerald-600 transition-colors cursor-pointer group-hover:scale-110 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xl font-black text-gray-700 group-hover:text-emerald-700 transition-colors">
                    {shareCount}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-emerald-600 transition-colors">
                    {shareCount === 1 ? "Share" : "Shares"}
                  </p>
                </div>
              </button>
            </div>

            {/* Article Content */}
            <div className="space-y-8">
              <p className="text-xl text-gray-700 italic leading-relaxed font-medium border-l-4 border-emerald-500 pl-6">
                {selectedArticle.excerpt}
              </p>
              
              <div 
                className="text-gray-700 leading-relaxed text-base max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: (selectedArticle.content || selectedArticle.excerpt || "Content not available.")
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .map(line => {
                      // Check if line is a list item
                      if (line.match(/^[\d]+\.|^[-*•]/)) {
                        return `<li class="ml-6 mb-2">${line.replace(/^[\d]+\.|^[-*•]\s*/, '')}</li>`;
                      }
                      // Check if line is a heading
                      if (line.match(/^#{1,6}\s/)) {
                        const level = line.match(/^#+/)[0].length;
                        const text = line.replace(/^#+\s/, '');
                        const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
                        return `<h${level} class="${sizes[level-1]} font-bold text-gray-900 mt-6 mb-3">${text}</h${level}>`;
                      }
                      // Regular paragraph
                      return `<p class="mb-4 leading-relaxed">${line}</p>`;
                    })
                    .join('')
                    .replace(/<li/g, '<ul class="list-disc space-y-2"><li')
                    .replace(/<\/li>/g, '</li></ul>')
                    .replace(/<\/ul><ul/g, '')
                }}
              />
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-10 sm:py-12 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white flex-shrink-0">
              <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Islamic Articles
              </h1>
              <p className="text-emerald-100 text-sm sm:text-lg mt-1">
                Explore insightful articles on Islamic knowledge and guidance
              </p>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-lg border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCatId || ""}
                onChange={(e) => setSelectedCatId(e.target.value || null)}
                className="w-full px-3 py-2.5 sm:py-3 rounded-lg border-2 border-white/30 focus:border-white text-gray-900 shadow-md transition-all bg-white text-sm font-medium"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id || cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner message="Loading articles..." />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">Error: {error}</p>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredArticles.map((a) => (
              <ArticleCard
                key={a.id}
                article={{
                  ...a,
                  image_url: a.image_url || DEFAULT_IMAGE,
                  tags: a.tags || [],
                  read_time: a.read_time || 5,
                  views: a.view_count || 0,
                  published_date: a.created_at || a.published_date,
                }}
                onReadMore={readMore}
                isAuthenticated={isAuthenticated}
                isLocallyFavorite={localFavorites.has(a.id)}
                handleLocalToggle={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm mx-auto">
              <Search className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-xl text-gray-600 font-bold mb-2">
                No articles found
              </p>
              <p className="text-gray-500 text-sm">
                Try a different search term.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white text-gray-600 py-6 mt-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-light">
            Nibras © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ArticlesPage;