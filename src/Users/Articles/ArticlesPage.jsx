import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "react-router-dom";
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

  return (
    <article
      onClick={() => onReadMore(article)}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-28 sm:h-32 overflow-hidden w-full">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_IMAGE;
          }}
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={handleLike}
            className="p-1 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-md"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-1 rounded-full bg-white/80 backdrop-blur hover:bg-white transition-colors shadow-md"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4 text-gray-500 hover:text-emerald-600" />
          </button>
        </div>
      </div>

      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
            {article.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap justify-between text-xs text-gray-500 gap-y-1">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-emerald-600" />
              <span className="font-medium text-gray-700 text-[11px]">
                {article.author}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="text-[11px]">{article.read_time} min</span>
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="text-[11px]">{article.views}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

const ArticlesPage = ({ categoryId }) => {
  const [searchParams] = useSearchParams();
  const { articleId } = useParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(categoryId || categoryFromUrl || null);
  const [view, setView] = useState(articleId ? "detail" : "articles");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());
  
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;


  const loadArticles = useCallback(async () => {
    if (!selectedCatId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchArticlesPaginated(1, 100, searchTerm, selectedCatId, null, token);
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(err.message);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCatId, searchTerm, token]);

  useEffect(() => {
    if (selectedCatId) {
      loadArticles();
    } else {
      setIsLoading(false);
    }
  }, [selectedCatId, loadArticles]);

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

  const filteredArticles = articles.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const readMore = async (art) => {
    try {
      const fullArticle = await fetchArticle(art.id, token);
      setSelectedArticle(fullArticle);
      setView("detail");
    } catch (err) {
      console.error("Failed to load article:", err);
      // Fallback to the article we have
      setSelectedArticle(art);
      setView("detail");
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
      // Refresh articles to get updated favorite status
      loadArticles();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Fallback to local toggle
      toggleLocal(articleId);
    }
  };


  if (view === "detail" && selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-xl shadow-xl p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedArticle.title}
            </h1>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-5">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {selectedArticle.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(selectedArticle.published_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedArticle.read_time} min
              </span>
            </div>
            <p className="text-base text-gray-700 mb-5 italic">
              {selectedArticle.excerpt}
            </p>
            <div 
              className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content || selectedArticle.excerpt || "Content not available." }}
            />
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

          <div className="mt-5 sm:mt-6">
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