import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpenCheck,
  Loader2,
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
} from "lucide-react";
const API_BASE = "https://focus-flow-server-v1.onrender.com/api";

const IMAGE_BASE = "https://focus-flow-server-v1.onrender.com";

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
  console.log("Redirecting user to login page...");
  console.log("Requirement: User must be logged in to save favorites.");
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
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);

  const [searchParams] = useSearchParams();
  const deepLinkDuaId = searchParams.get("duaId");

  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

  const generateShareLink = async (duaId) => {
    try {
      const res = await fetch(`${API_BASE}/duas/${duaId}/share-link`, {
        method: "POST",
        headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(
          `Failed to generate share link for Dua ID ${duaId}. Status: ${res.status}. Response: ${errorText}`
        );
        throw new Error("Failed to generate share link on server.");
      }

      const data = await res.json();
      console.log("----------------------------------------------");
      console.log(` SUCCESS: Share Link generated for Dua ID: ${duaId}`);
      console.log(
        `VERIFY DB: A new short code should be in the 'dua_share_link' table.`
      );
      console.log(`Generated Share URL: ${data.share_url}`);
      console.log("----------------------------------------------");
      return data.share_url;
    } catch (err) {
      console.error("API Error during share link generation:", err);
      throw err;
    }
  };

  const fetchDuasAndCategories = useCallback(
    async (q = "") => {
      setLoading(true);
      try {
        const fetchOptions = {
          headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
        };

        const catRes = await fetch(`${API_BASE}/dua-categories`);
        if (!catRes.ok) throw new Error("Failed to fetch categories.");
        const catData = await catRes.json();

        const url = `${API_BASE}/duas/paginated?q=${encodeURIComponent(
          q
        )}&limit=1000`;
        const duasRes = await fetch(url, fetchOptions);
        if (duasRes.status === 401 && isAuthenticated) {
          redirectToLogin();
          throw new Error("Authentication failed.");
        }
        if (!duasRes.ok) throw new Error("Failed to fetch duas.");
        let duasData = await duasRes.json();

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
          if (categoryId && !selectedCategoryId) {
            setSelectedCategoryId(categoryId);
            setView("duas");
          } else if (!categoryId) {
            setView("categories");
            setSelectedCategoryId(null);
          }
        }
      } catch (err) {
        if (
          !isAuthenticated ||
          !err.message.includes("Authentication failed")
        ) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [AUTH_TOKEN, isAuthenticated, categoryId, selectedCategoryId]
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
    if (!searchExecuted && view === "categories" && !deepLinkDuaId) {
      fetchDuasAndCategories("");
    }
  }, [fetchDuasAndCategories, view, searchExecuted, deepLinkDuaId]);

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
        searchParams.delete("duaId");
      }
    } else if (categoryId) {
      setSelectedCategoryId(categoryId);
      setView("duas");
    }
  }, [deepLinkDuaId, categories, categoryId, fetchDuasAndCategories]);

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
      const res = await fetch(`${API_BASE}/duas/${duaId}/toggle-favorite`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      if (res.status === 401) {
        redirectToLogin();
        return;
      }
      if (!res.ok) throw new Error("Failed to toggle favorite.");
      const { favorites } = await res.json();
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
        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading...</p>
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

  const showHeaderImage =
    (categoryImageUrl && selectedCategoryId !== "search") ||
    selectedCategoryId === "search";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <header className="bg-white text-gray-900 py-12 border-b-4 border-gray-100 shadow-lg">
        <div className="max-w-7xl mx-auto text-center px-4">
          {showHeaderImage ? (
            categoryImageUrl && selectedCategoryId !== "search" ? (
              <img
                src={categoryImageUrl}
                alt={`${pageTitle} category`}
                className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-white shadow-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-xl">
                {selectedCategoryId === "search" ? (
                  <Search className="w-12 h-12 text-emerald-500" />
                ) : (
                  <BookOpenCheck className="w-12 h-12 text-emerald-500" />
                )}
              </div>
            )
          ) : null}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-700 font-light mb-4">
            A beautiful collection of supplications to enrich your daily life.
          </p>
          {currentCategory && (
            <CategoryDescription description={categoryDescription} />
          )}
        </div>
      </header>

      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {showCategories ? (
            <div
              className={`relative flex items-center transition-all duration-300 ${
                searchFocused ? "transform scale-105" : ""
              }`}
            >
              <button
                onClick={executeSearch}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-600 p-3 transition-colors z-20"
                aria-label="Execute search"
              >
                <Search className="w-6 h-6" />
              </button>

              <input
                type="text"
                placeholder="Search for duas by title, arabic text, or transliteration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 text-gray-700 placeholder-gray-400 text-base shadow-sm transition-all duration-300 bg-white"
              />

              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10 p-4"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors px-4 py-5 rounded-full"
              aria-label="Back to all categories"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-4 mx-auto" />
            <p className="text-gray-600 font-medium">
              Loading search results...
            </p>
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
