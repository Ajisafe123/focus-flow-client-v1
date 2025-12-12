import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpenCheck,
  Search,
  Heart,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  BookOpen,
  X,
  ArrowLeft,
} from "lucide-react";
import LoadingSpinner from "../../Common/LoadingSpinner";
import { API_BASE_URL } from "../../Components/Service/apiService";
import {
  fetchHadithCategories,
  fetchHadithsPaginated,
  shareHadith,
  toggleHadithFavorite as toggleHadithFavoriteApi,
} from "../Service/apiService";

const FRONTEND_BASE = "https://nibrasudeen.vercel.app";
const API_BASE = `${API_BASE_URL}/api`;
const IMAGE_BASE = API_BASE_URL;

const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  let path = relativePath.trim();
  if (!path.startsWith("/static/")) {
    path = `/static/category_images/${path}`;
  }
  if (path.startsWith("//")) path = path.replace(/^\/+/, "/");
  return `${IMAGE_BASE}${path}`;
};

const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
};

const redirectToLogin = () => {
  const currentPath = window.location.pathname + window.location.search;
  localStorage.setItem("post_login_redirect", currentPath);
  window.location.href = `${FRONTEND_BASE}/login`;
};

const CategoryCard = ({ category, onClick }) => {
  const imageUrl = getFullImageUrl(category.image_url);
  return (
    <button
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full text-left transform hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpenCheck className="w-16 h-16 text-emerald-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-emerald-600 transition-colors line-clamp-2">
          {category.name}
        </h3>
      </div>
    </button>
  );
};

const HadithItem = ({
  hadith,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
  openDetails,
  setOpenDetails,
  generateShareLink,
  onDelete,
}) => {
  const [shareUrl, setShareUrl] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isFavorite = isAuthenticated
    ? hadith.is_favorite || false
    : isLocallyFavorite;

  const handleLikeClick = () => {
    if (!isAuthenticated) handleLocalToggle(hadith.id);
    else toggleFavorite(hadith.id);
  };

  const handleShareClick = async () => {
    if (isSharing) return;
    setShareUrl(null);
    setIsSharing(true);
    try {
      const url = await generateShareLink(hadith.id);
      setShareUrl(url);
      if (navigator.share) {
        await navigator.share({
          title: `Hadith #${hadith.number || hadith.id}`,
          text: `Check this authentic Hadith`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert(`Copied share link: ${url}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareUrl(null), 5000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this hadith?")) return;
    setIsDeleting(true);
    try {
      await onDelete(hadith.id);
    } catch (e) {
      console.error("Failed to delete hadith:", e);
      alert("Failed to delete hadith");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDetail = (key) => {
    const cur = openDetails[hadith.id];
    setOpenDetails((prev) => ({
      ...prev,
      [hadith.id]: cur === key ? null : key,
    }));
  };

  const renderDetail = (key, title, content, icon) => {
    if (!content) return null;
    const isOpen = openDetails[hadith.id] === key;
    return (
      <div className="border-b border-gray-100 last:border-0">
        <button
          onClick={() => toggleDetail(key)}
          className="w-full flex justify-between items-center py-3 px-2 text-gray-700 hover:text-emerald-600 transition-colors hover:bg-emerald-50 rounded-lg"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold">{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isOpen && (
          <div className="pb-3 pt-1 px-2 animate-fadeIn">
            <p className="text-sm leading-relaxed text-gray-800">{content}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <article className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 hover:border-emerald-300">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn .3s ease-out; }
      `}</style>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-emerald-100">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-emerald-900">
              Hadith #{hadith.number || hadith.id}
            </h3>
            {hadith.narrator && (
              <p className="text-sm text-emerald-700 mt-1 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Narrated by: <span className="font-semibold">{hadith.narrator}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleShareClick}
              disabled={isSharing}
              className="p-2.5 rounded-full hover:bg-emerald-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Share Hadith"
              title="Share this hadith"
            >
              {isSharing ? (
                <div className="w-5 h-5 animate-spin border-2 border-emerald-400 border-t-emerald-600 rounded-full" />
              ) : (
                <Share2
                  className={`w-5 h-5 transition-colors ${shareUrl
                      ? "text-emerald-600 fill-emerald-200"
                      : "text-gray-500 hover:text-emerald-600"
                    }`}
                />
              )}
            </button>

            <button
              onClick={handleLikeClick}
              className="p-2.5 rounded-full hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-5 h-5 transition-all ${isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-500 hover:text-red-500"
                  }`}
              />
            </button>

            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2.5 rounded-full hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Delete Hadith"
                title="Delete this hadith"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 animate-spin border-2 border-red-400 border-t-red-600 rounded-full" />
                ) : (
                  <X className="w-5 h-5 text-gray-500 hover:text-red-600 transition-colors" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {hadith.arabic ? (
          <div
            dir="rtl"
            className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-xl p-5 border border-emerald-200"
          >
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">Arabic Text</p>
            <p
              className="text-lg text-right text-gray-900 leading-relaxed"
              style={{
                fontFamily: "Amiri, 'Times New Roman', serif",
                lineHeight: "2.4",
                letterSpacing: "0.5px",
              }}
            >
              {hadith.arabic}
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">⚠️ Note:</span> Arabic text not available for this hadith.
            </p>
          </div>
        )}

        {(() => {
          const englishText = typeof hadith.english === "object" ? hadith.english?.text : hadith.english;
          const narrator = typeof hadith.english === "object" ? hadith.english?.narrator : null;
          
          if (englishText) {
            return (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">English Translation</p>
                {narrator && (
                  <p className="text-sm text-blue-900 font-semibold mb-3 italic">
                    {narrator}
                  </p>
                )}
                <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {englishText}
                </p>
              </div>
            );
          }
          
          if (hadith.translation) {
            return (
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-3">Translation</p>
                <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {hadith.translation}
                </p>
              </div>
            );
          }
          
          return null;
        })()}

        {hadith.book && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Source</p>
              <p className="text-sm text-blue-900 font-medium">{hadith.book}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 border-t border-gray-100 pt-4">
          {renderDetail(
            "source",
            "Additional Info",
            hadith.source,
            <Share2 className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {shareUrl && !navigator.share && (
        <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg text-sm text-emerald-900 break-all border-2 border-emerald-300 shadow-sm">
          <p className="font-semibold text-emerald-700 mb-2">✓ Link Copied!</p>
          <p className="font-mono text-xs text-emerald-800 bg-white p-2 rounded border border-emerald-200">{shareUrl}</p>
        </div>
      )}
    </article>
  );
};

const CategoryDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const needToggle =
    description &&
    (description.split("\n").length > 3 || description.length > 200);

  return (
    <div className="mx-auto max-w-3xl leading-relaxed text-center mt-3">
      <p
        className={`text-lg text-gray-600 font-light mx-auto whitespace-pre-line transition-all duration-300 ${expanded ? "" : "line-clamp-3"
          }`}
      >
        {description}
      </p>
      {needToggle && (
        <div className="flex justify-start max-w-3xl mx-auto">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-2 flex items-center transition-colors"
          >
            {expanded ? "See less" : "See more"}
            {expanded ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default function HadithViewer() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());
  const [openDetails, setOpenDetails] = useState({});
  const [view, setView] = useState("categories");
  const [searchExecuted, setSearchExecuted] = useState(false);

  const [searchParams] = useSearchParams();
  const deepLinkHadithId = searchParams.get("hadithId");
  const urlCategoryId = searchParams.get("category_id");

  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

  const generateShareLink = async (hadithId) => {
    try {
      const data = await shareHadith(hadithId, AUTH_TOKEN);
      const backendShareUrl = data?.share_url;
      return backendShareUrl || `${FRONTEND_BASE}/hadiths?hadithId=${hadithId}`;
    } catch (e) {
      console.error(e);
    }
    return `${FRONTEND_BASE}/hadiths?hadithId=${hadithId}`;
  };

  const fetchHadithsAndCategories = useCallback(
    async (q = "") => {
      setLoading(true);
      try {
        const catData = await fetchHadithCategories();
        const hadResponse = await fetchHadithsPaginated(q, AUTH_TOKEN);

        const hadData = Array.isArray(hadResponse)
          ? hadResponse
          : hadResponse.items || [];

        if (q) {
          const searchCat = {
            id: "search",
            name: `Search Results for "${q}"`,
            description: "All hadiths matching your query.",
            image_url: null,
            hadiths: hadData,
          };
          setCategories([searchCat]);
          setSelectedCategoryId("search");
          setView("hadiths");
        } else {
          const grouped = catData.map((c) => ({
            ...c,
            hadiths: hadData.filter((h) => h.category_id === c.id),
          }));
          setCategories(grouped);

          const initCat = urlCategoryId || null;
          if (initCat) {
            setSelectedCategoryId(initCat);
            setView("hadiths");
          } else {
            setView("categories");
            setSelectedCategoryId(null);
          }
        }
      } catch (e) {
        if (e.status === 401 && isAuthenticated) {
          redirectToLogin();
          return;
        }
        if (!isAuthenticated || e.status !== 401) console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [AUTH_TOKEN, isAuthenticated, urlCategoryId]
  );

  const executeSearch = useCallback(() => {
    if (searchTerm.trim()) {
      setSearchExecuted(true);
      fetchHadithsAndCategories(searchTerm.trim());
    } else {
      clearSearch();
    }
  }, [fetchHadithsAndCategories, searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") executeSearch();
  };

  useEffect(() => {
    if (!searchExecuted && !deepLinkHadithId) fetchHadithsAndCategories("");
  }, [fetchHadithsAndCategories, searchExecuted, deepLinkHadithId]);

  useEffect(() => {
    if (deepLinkHadithId && categories.length) {
      let targetCat = null;
      let foundHadith = null;

      for (const cat of categories) {
        foundHadith = cat.hadiths.find(
          (h) => h.id.toString() === deepLinkHadithId
        );
        if (foundHadith) {
          targetCat = cat.id;
          break;
        }
      }
      if (foundHadith && targetCat) {
        setSelectedCategoryId(targetCat);
        setView("hadiths");
        setOpenDetails({ [foundHadith.id]: "translation" });
      }
    } else if (urlCategoryId) {
      setSelectedCategoryId(urlCategoryId);
      setView("hadiths");
    }
  }, [deepLinkHadithId, categories, urlCategoryId, fetchHadithsAndCategories]);

  const handleLocalToggle = (id) => {
    setLocalFavorites((s) => {
      const ns = new Set(s);
      if (ns.has(id)) ns.delete(id);
      else {
        ns.add(id);
        redirectToLogin();
      }
      return ns;
    });
  };

  const toggleFavorite = async (id) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    try {
      const { favorites } = await toggleHadithFavoriteApi(id, AUTH_TOKEN);

      const updater = (h) =>
        h.id === id
          ? { ...h, is_favorite: !h.is_favorite, favorite_count: favorites }
          : h;

      setCategories((prev) =>
        prev.map((c) => ({
          ...c,
          hadiths: c.hadiths.map(updater),
        }))
      );
    } catch (e) {
      if (e.status === 401) {
        redirectToLogin();
        return;
      }
      console.error(e);
    }
  };

  const handleDeleteHadith = async (hadithId) => {
    try {
      const response = await fetch(`${API_BASE}/hadiths/${hadithId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete hadith");
      }

      setCategories((prev) =>
        prev.map((c) => ({
          ...c,
          hadiths: c.hadiths.filter((h) => h.id !== hadithId),
        }))
      );
    } catch (e) {
      console.error("Error deleting hadith:", e);
      throw e;
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchExecuted(false);
    setSelectedCategoryId(null);
    setView("categories");
    fetchHadithsAndCategories("");
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    setView("hadiths");
    setOpenDetails({});
  };

  const handleBackToCategories = () => {
    setView("categories");
    setSelectedCategoryId(null);
    setSearchTerm("");
    setSearchExecuted(false);
    setOpenDetails({});
    fetchHadithsAndCategories("");
  };

  if (loading && !searchExecuted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <LoadingSpinner message="Loading hadiths..." />
      </div>
    );
  }

  const currentCategory = selectedCategoryId
    ? categories.find((c) => c.id.toString() === selectedCategoryId.toString())
    : null;

  const pageTitle = currentCategory?.name || "All Hadiths";
  const categoryDescription =
    currentCategory?.description ||
    "Browse authentic prophetic sayings, neatly organized by topic.";

  const showCategories = view === "categories" && !searchExecuted;
  const showHadiths = view === "hadiths" && currentCategory;
  const showNoResults =
    searchExecuted && currentCategory && currentCategory.hadiths.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 sm:py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border-2 border-white flex-shrink-0">
              <BookOpenCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-emerald-100 text-base sm:text-lg mt-1">
                {currentCategory
                  ? "Authentic sayings of the Prophet (Peace be upon him)"
                  : "Explore the complete collection"}
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search hadiths by Arabic, translation, book, or narrator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!showCategories && (
              <div className="mt-3 flex justify-start">
                <button
                  onClick={handleBackToCategories}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </button>
              </div>
            )}

            {showCategories && currentCategory && (
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <CategoryDescription description={categoryDescription} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        {loading ? (
          <div className="text-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : showCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        ) : showHadiths && currentCategory.hadiths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.hadiths.map((hadith) => (
              <HadithItem
                key={hadith.id}
                hadith={hadith}
                toggleFavorite={toggleFavorite}
                isAuthenticated={isAuthenticated}
                isLocallyFavorite={localFavorites.has(hadith.id)}
                handleLocalToggle={handleLocalToggle}
                openDetails={openDetails}
                setOpenDetails={setOpenDetails}
                generateShareLink={generateShareLink}
                onDelete={isAuthenticated ? handleDeleteHadith : null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-600 font-bold mb-2">
                No Hadiths Found
              </p>
              <p className="text-gray-500">
                {searchExecuted
                  ? `No matches for "${searchTerm}".`
                  : "No categories available."}
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-white text-gray-800 py-8 mt-16 shadow-inner border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-medium">
            May Allah increase us in beneficial knowledge.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            FocusFlow Copyright {new Date().getFullYear()} - All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
