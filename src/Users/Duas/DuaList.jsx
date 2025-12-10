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
  Volume2,
  X,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";
import LoadingSpinner from "../../Common/LoadingSpinner.jsx";
import { API_BASE_URL } from "../../Components/Service/apiService.js";
import {
  fetchDuaCategories,
  fetchDuasPaginated,
  shareDua,
  toggleDuaFavorite as toggleDuaFavoriteApi,
} from "../Service/apiService.js";

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
  if (path.startsWith("//")) {
    path = path.replace(/^\/+/, "/");
  }
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
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpenCheck className="w-16 h-16 text-emerald-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-emerald-600 transition-colors line-clamp-2">
          {category.name}
        </h3>
      </div>
    </button>
  );
};

const DuaItem = ({
  dua,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
  openDetails,
  setOpenDetails,
  generateShareLink,
}) => {
  const [shareUrl, setShareUrl] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const isFavorite = isAuthenticated
    ? dua.is_favorite || false
    : isLocallyFavorite;

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      handleLocalToggle(dua.id);
    } else {
      toggleFavorite(dua.id);
    }
  };

  const handleShareClick = async () => {
    if (isSharing) return;

    setShareUrl(null);
    setIsSharing(true);

    try {
      const url = await generateShareLink(dua.id);
      setShareUrl(url);

      if (navigator.share) {
        await navigator.share({
          title: dua.title || "Dua Share",
          text: `Check out this beautiful Dua: ${dua.title}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert(
          `Successfully generated and copied share link to clipboard: ${url}`
        );
      }
    } catch (error) {
      if (
        error.name !== "AbortError" &&
        error.name !== "NotAllowedError" &&
        error.name !== "NotShareableException"
      ) {
        console.error("Error generating or sharing link:", error);
        alert("Failed to generate share link. Check the console for details.");
      }
    } finally {
      setIsSharing(false);
      setTimeout(() => setShareUrl(null), 5000);
    }
  };

  const toggleDetail = (key) => {
    const currentActiveDetail = openDetails[dua.id];
    const newActiveDetail = currentActiveDetail === key ? null : key;
    setOpenDetails((prev) => ({
      ...prev,
      [dua.id]: newActiveDetail,
    }));
  };

  const renderDetail = (key, title, content, icon) => {
    if (!content && (key !== "audio" || !dua.audio_url)) return null;
    if (key === "notes") return null;
    const isOpen = openDetails[dua.id] === key;
    const displayContent =
      key === "audio" && dua.audio_url ? (
        <audio controls className="w-full mt-2">
          <source src={getFullImageUrl(dua.audio_url)} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        content
      );

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
            {key !== "audio" ? (
              <p
                className={`text-sm leading-relaxed ${
                  key === "transliteration"
                    ? "italic text-gray-600"
                    : "text-gray-800"
                }`}
              >
                {displayContent}
              </p>
            ) : (
              displayContent
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
      <div className="mb-4 flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2">
          {dua.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleShareClick}
            className="p-2 rounded-full hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Share Dua"
            disabled={isSharing}
          >
            {isSharing ? (
              <div className="w-5 h-5 loader" />
            ) : (
              <Share2
                className={`w-5 h-5 ${
                  shareUrl
                    ? "text-emerald-500 fill-emerald-100"
                    : "text-gray-400 hover:text-emerald-500"
                }`}
              />
            )}
          </button>

          <button
            onClick={handleLikeClick}
            className="p-2 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-3 border-b border-gray-100 pb-5 mb-4">
        <div
          dir="rtl"
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4"
        >
          <p
            className="text-xl text-right text-gray-900 leading-loose"
            style={{
              fontFamily: "Amiri, 'Times New Roman', serif",
              lineHeight: "2.2",
            }}
          >
            {dua.arabic}
          </p>
        </div>
        {dua.repetition_count > 0 && (
          <p className="text-xs text-gray-500 text-right pr-2 font-semibold">
            ({dua.repetition_count}x)
          </p>
        )}

        {dua.notes && (
          <div className="mt-3 bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg">
            <p className="text-xs font-bold text-amber-700 mb-1">Note:</p>
            <p className="text-sm text-gray-700 leading-relaxed">{dua.notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-1">
        {renderDetail(
          "translation",
          "Translation",
          dua.translation,
          <BookOpen className="w-4 h-4 text-emerald-600" />
        )}

        {renderDetail(
          "transliteration",
          "Transliteration",
          dua.transliteration,
          <Tag className="w-4 h-4 text-emerald-600" />
        )}

        {renderDetail(
          "benefits",
          "Virtue",
          dua.benefits,
          <Heart className="w-4 h-4 text-red-500" />
        )}

        {renderDetail(
          "source",
          "Source",
          dua.source,
          <Share2 className="w-4 h-4 text-gray-500" />
        )}

        {renderDetail(
          "audio",
          "Audio",
          null,
          <Volume2 className="w-4 h-4 text-emerald-600" />
        )}
      </div>

      {shareUrl && !navigator.share && (
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800 break-all border border-emerald-200">
          Link (Copied!): <strong className="font-mono">{shareUrl}</strong>
        </div>
      )}
    </article>
  );
};

const CategoryDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showToggle =
    description &&
    (description.split("\n").length > 3 || description.length > 200);

  return (
    <div className="mx-auto max-w-3xl leading-relaxed text-center mt-3">
      <p
        className={`text-lg text-gray-600 font-light mx-auto whitespace-pre-line transition-all duration-300 ${
          isExpanded ? "" : "line-clamp-3"
        }`}
      >
        {description}
      </p>
      {showToggle && (
        <div className="flex justify-start max-w-3xl mx-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 mt-2 flex items-center transition-colors"
            aria-label={
              isExpanded ? "See less description" : "See more description"
            }
          >
            {isExpanded ? "See less" : "See more"}
            {isExpanded ? (
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

const DuaCategoryPage = ({ categoryId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [localFavorites, setLocalFavorites] = useState(new Set());
  const [openDetails, setOpenDetails] = useState({});
  const [view, setView] = useState(categoryId ? "duas" : "categories");
  const [searchExecuted, setSearchExecuted] = useState(false);

  const [searchParams] = useSearchParams();
  const deepLinkDuaId = searchParams.get("duaId");
  const urlCategoryId = searchParams.get("category_id");

  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

  const generateShareLink = async (duaId) => {
    try {
      const data = await shareDua(duaId, AUTH_TOKEN);
      const backendShareUrl = data?.share_url;
      const fullShareUrl = `${FRONTEND_BASE}/duas?duaId=${duaId}`;
      return backendShareUrl || fullShareUrl;
    } catch (err) {
      console.error("API Error during share link generation (tracking):", err);
      const fallbackUrl = `${FRONTEND_BASE}/duas?duaId=${duaId}`;
      return fallbackUrl;
    }
  };

  const fetchDuasAndCategories = useCallback(
    async (q = "") => {
      setLoading(true);
      try {
        const catData = await fetchDuaCategories();
        const duasData = await fetchDuasPaginated(q, AUTH_TOKEN);

        if (q) {
          const searchCategory = {
            id: "search",
            name: `Search Results for "${q}"`,
            description: `Showing all Duas matching your query.`,
            image_url: null,
            duas: duasData,
          };
          setCategories([searchCategory]);
          setSelectedCategoryId("search");
          setView("duas");
        } else {
          const groupedDuas = catData.map((cat) => ({
            ...cat,
            duas: duasData.filter((d) => d.category_id === cat.id),
          }));
          setCategories(groupedDuas);

          const initialCategoryId = urlCategoryId || categoryId;

          if (initialCategoryId) {
            setSelectedCategoryId(initialCategoryId.toString());
            setView("duas");
          } else {
            setView("categories");
            setSelectedCategoryId(null);
          }
        }
      } catch (err) {
        if (err.status === 401 && isAuthenticated) {
          redirectToLogin();
          return;
        }
        if (!isAuthenticated || err.status !== 401) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [AUTH_TOKEN, isAuthenticated, categoryId, urlCategoryId]
  );

  const executeSearch = useCallback(() => {
    if (searchTerm.trim()) {
      setSearchExecuted(true);
      fetchDuasAndCategories(searchTerm.trim());
    } else {
      clearSearch();
    }
  }, [fetchDuasAndCategories, searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  useEffect(() => {
    if (!searchExecuted && !deepLinkDuaId) {
      fetchDuasAndCategories("");
    }
  }, [fetchDuasAndCategories, searchExecuted, deepLinkDuaId]);

  useEffect(() => {
    if (deepLinkDuaId) {
      if (categories.length === 0) {
        fetchDuasAndCategories("");
        return;
      }

      let duaToFocus = null;
      let targetCategoryId = null;

      for (const cat of categories) {
        duaToFocus = cat.duas.find(
          (d) => d.id.toString() === deepLinkDuaId.toString()
        );
        if (duaToFocus) {
          targetCategoryId = cat.id;
          break;
        }
      }

      if (duaToFocus && targetCategoryId) {
        setSelectedCategoryId(targetCategoryId);
        setView("duas");
        setOpenDetails({ [duaToFocus.id]: "translation" });
      }
    } else if (urlCategoryId) {
      setSelectedCategoryId(urlCategoryId);
      setView("duas");
    } else if (categoryId) {
      setSelectedCategoryId(categoryId);
      setView("duas");
    }
  }, [
    deepLinkDuaId,
    categories,
    categoryId,
    urlCategoryId,
    fetchDuasAndCategories,
  ]);

  const handleLocalToggle = (duaId) => {
    setLocalFavorites((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(duaId)) {
        newSet.delete(duaId);
      } else {
        newSet.add(duaId);
        redirectToLogin();
      }
      return newSet;
    });
  };

  const toggleFavorite = async (duaId) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    try {
      const { favorites } = await toggleDuaFavoriteApi(duaId, AUTH_TOKEN);
      const updateDua = (dua) => {
        if (dua.id === duaId) {
          return {
            ...dua,
            is_favorite: !dua.is_favorite,
            favorite_count: favorites,
          };
        }
        return dua;
      };
      setCategories((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          duas: group.duas.map(updateDua),
        }))
      );
    } catch (err) {
      if (err.status === 401) {
        redirectToLogin();
        return;
      }
      console.error("Error toggling favorite:", err);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchExecuted(false);
    setSelectedCategoryId(null);
    setView("categories");
    fetchDuasAndCategories("");
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategoryId(catId);
    setView("duas");
    setOpenDetails({});
  };

  const handleBackToCategories = () => {
    setView("categories");
    setSelectedCategoryId(null);
    setSearchTerm("");
    setSearchExecuted(false);
    setOpenDetails({});
    fetchDuasAndCategories("");
  };

  if (loading && !searchExecuted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <LoadingSpinner size="large" message="Loading..." />
      </div>
    );
  }

  const currentCategory = selectedCategoryId
    ? categories.find(
        (cat) => cat.id.toString() === selectedCategoryId.toString()
      )
    : null;

  const pageTitle = currentCategory?.name || "All Duas & Adhkar";
  const categoryDescription =
    currentCategory?.description ||
    "Browse through our curated collection of supplications and remembrances, categorized for ease of access.";
  const categoryImageUrl = currentCategory
    ? getFullImageUrl(currentCategory.image_url)
    : null;

  const showDuas = view === "duas" || (searchExecuted && currentCategory);
  const showCategories = view === "categories" && !searchExecuted;

  const showNoResults =
    searchExecuted && currentCategory && currentCategory.duas.length === 0;

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
                  ? "Essential supplications for every moment"
                  : "Explore essential resources for the Islamic classroom"}
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                placeholder="Search duas by title, arabic text, or transliteration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-xl border-2 border-white/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-md transition-all bg-white text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label="Clear search"
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
                  aria-label="Back to all categories"
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
            <LoadingSpinner size="large" message="Loading search results..." />
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
        ) : showDuas && currentCategory && currentCategory.duas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory.duas.map((dua) => (
              <DuaItem
                key={dua.id}
                dua={dua}
                toggleFavorite={toggleFavorite}
                isAuthenticated={isAuthenticated}
                isLocallyFavorite={localFavorites.has(dua.id)}
                handleLocalToggle={handleLocalToggle}
                openDetails={openDetails}
                setOpenDetails={setOpenDetails}
                generateShareLink={generateShareLink}
              />
            ))}
          </div>
        ) : (
          (showNoResults || categories.length === 0) && (
            <div className="text-center py-20">
              <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-2xl text-gray-600 font-bold mb-2">
                  Dua Not Available
                </p>
                <p className="text-gray-500">
                  {searchExecuted
                    ? `No Duas found matching your search term: "${searchTerm}".`
                    : "No categories found. Please check your data source."}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      <footer className="bg-white text-gray-800 py-8 mt-16 shadow-inner border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-base font-medium">
            May Allah accept our prayers and acts of remembrance.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            FocusFlow © {new Date().getFullYear()} - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DuaCategoryPage;
