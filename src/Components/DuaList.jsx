import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpenCheck,
  Loader2,
  Search,
  Heart,
  ChevronDown,
  ChevronUp,
  Tag,
  Share2,
  Bookmark,
  BookOpen,
  Home,
  Volume2,
  Info,
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
      className="group cursor-pointer bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden w-full text-left"
    >
      <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpenCheck className="w-16 h-16 text-emerald-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-emerald-600 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 text-center mt-1">
          {category.duas.length} {category.duas.length === 1 ? "Dua" : "Duas"}
        </p>
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
}) => {
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
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleDetail(key)}
          className="w-full flex justify-between items-center py-3 px-1 text-gray-700 hover:text-emerald-600 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-base font-medium">{title}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-emerald-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isOpen && (
          <div className="pb-3 pt-1 px-1">
            {key !== "audio" ? (
              <p
                className={`text-base ${
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
    <article className="pb-8 px-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-gray-800">{dua.title}</h3>
        </div>
        <button
          onClick={handleLikeClick}
          className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-default"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>
      </div>

      <div className="space-y-3 border-b border-gray-200 pb-6">
        <div dir="rtl">
          <p
            className="text-2xl text-right text-gray-900 leading-relaxed py-2"
            style={{
              fontFamily: "Amiri, 'Times New Roman', serif",
              lineHeight: "2.0",
            }}
          >
            {dua.arabic}
          </p>
        </div>
        {dua.repetition_count > 0 && (
          <p className="text-sm text-gray-500 text-right pr-2">
            ({dua.repetition_count}x)
          </p>
        )}

        {dua.notes && (
          <div className="mt-4 text-gray-700 text-right">
            <p className="text-base font-medium inline-block pr-2 bg-emerald-50 text-emerald-700 rounded-lg px-2 py-0.5">
              Note:
            </p>
            <p className="text-base inline-block text-gray-700 leading-relaxed max-w-full">
              {dua.notes}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
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
    </article>
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

  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

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
        const url = q
          ? `${API_BASE}/duas/paginated?q=${encodeURIComponent(q)}&limit=1000`
          : `${API_BASE}/duas/paginated?limit=1000`;
        const duasRes = await fetch(url, fetchOptions);
        if (duasRes.status === 401 && isAuthenticated) {
          redirectToLogin();
          throw new Error("Authentication failed.");
        }
        if (!duasRes.ok) throw new Error("Failed to fetch duas.");
        let duasData = await duasRes.json();
        const groupedDuas = catData.map((cat) => ({
          ...cat,
          duas: duasData.filter((d) => d.category_id === cat.id),
        }));
        setCategories(groupedDuas);
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
    [AUTH_TOKEN, isAuthenticated]
  );

  useEffect(() => {
    fetchDuasAndCategories();
  }, [fetchDuasAndCategories]);

  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
      setView("duas");
    }
  }, [categoryId]);

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

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchDuasAndCategories(term);
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
    setOpenDetails({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const currentCategory = selectedCategoryId
    ? categories.find(
        (cat) => cat.id.toString() === selectedCategoryId.toString()
      )
    : null;

  const pageTitle = currentCategory?.name || "أدعية وأذكار";
  const categoryDescription =
    currentCategory?.description || "Description not available";
  const categoryImageUrl = currentCategory
    ? getFullImageUrl(currentCategory.image_url)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-green-800 py-10 border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center px-4">
          {categoryImageUrl ? (
            <img
              src={categoryImageUrl}
              alt={`${pageTitle} category`}
              className="w-20 h-20 object-cover rounded-full mx-auto mb-3 border-4 border-emerald-500"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <BookOpenCheck className="w-10 h-10 text-green-800 mx-auto mb-2" />
          )}
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {pageTitle}
          </h1>
          {currentCategory && (
            <div className="mt-4 text-center">
              <p className="text-lg text-gray-700 font-light mx-auto whitespace-pre-line max-w-3xl">
                {categoryDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {view === "categories" && (
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto py-4 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Duas by title or text..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700 placeholder-gray-400 text-sm shadow-sm transition"
              />
            </div>
          </div>
        </div>
      )}

      {view === "duas" && !categoryId && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Categories
          </button>
        </div>
      )}

      <div className="max-w-6xl mx-auto py-8 px-4 relative z-10">
        {view === "categories" ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => handleCategoryClick(cat.id)}
              />
            ))}
          </div>
        ) : (
          currentCategory && (
            <div className="space-y-12">
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
                />
              ))}
            </div>
          )
        )}

        {categories.length === 0 && !loading && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              No categories found
            </p>
            <p className="text-gray-500 mt-2">
              Check your API connection or data source.
            </p>
          </div>
        )}
      </div>

      <footer className="text-green-800 py-6 mt-12 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-emerald-500 text-sm">
            May Allah accept our prayers and remembrance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DuaCategoryPage;
