import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpenCheck,
  Loader2,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";

const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
};

const redirectToLogin = () => {
  console.log("Redirecting user to login page...");
  console.log("Requirement: User must be logged in to save favorites.");
};

const DuaItem = ({
  dua,
  index,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
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

  return (
    <article key={dua.id} className="border-b border-gray-200 pb-8 px-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-600 uppercase">
            Dua #{index + 1}
          </span>
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

      <div className="space-y-5">
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
        <div className="text-base text-gray-600 italic border-l-4 border-gray-300 pl-3">
          {dua.transliteration}
        </div>
        {dua.translation && (
          <div className="p-3 border-l-4 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-700 mb-1 uppercase tracking-wide">
              Meaning
            </p>
            <p className="text-base text-gray-800 font-medium">
              {dua.translation}
            </p>
          </div>
        )}
        {(dua.notes || dua.benefits || dua.source) && (
          <div className="pt-4 border-t border-dashed border-gray-100 space-y-2 text-sm">
            {dua.benefits && (
              <p className="text-gray-700 flex items-center gap-1">
                <Heart className="w-4 h-4 text-emerald-600" />
                {dua.benefits}
              </p>
            )}
            {dua.notes && (
              <p className="text-gray-700 flex items-center gap-1">
                <Bookmark className="w-4 h-4 text-gray-500" />
                {dua.notes}
              </p>
            )}
            {dua.source && (
              <p className="text-xs italic text-gray-500 flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {dua.source}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default function DuaApp() {
  const [categories, setCategories] = useState([]);
  const [allDuas, setAllDuas] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [localFavorites, setLocalFavorites] = useState(new Set());

  const API_BASE = "http://127.0.0.1:8000/api";
  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

  const fetchDuasAndCategories = useCallback(
    async (q = "") => {
      setLoading(true);
      setError(null);
      try {
        const fetchOptions = {
          headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
        };

        const catRes = await fetch(`${API_BASE}/categories`);
        if (!catRes.ok) throw new Error("Failed to fetch categories.");
        const catData = await catRes.json();

        const catMap = catData.reduce((map, cat) => {
          map[cat.id] = cat.name;
          return map;
        }, {});
        setCategoriesMap(catMap);

        const url = q
          ? `${API_BASE}/duas/paginated?q=${encodeURIComponent(q)}&limit=1000`
          : `${API_BASE}/duas/paginated?limit=1000`;

        const duasRes = await fetch(url, fetchOptions);

        if (duasRes.status === 401 && isAuthenticated) {
          redirectToLogin();
          throw new Error("Authentication failed. Redirecting to login.");
        }
        if (!duasRes.ok) throw new Error("Failed to fetch duas.");

        let duasData = await duasRes.json();

        setAllDuas(duasData);

        const groupedDuas = catData
          .map((cat) => ({
            name: cat.name,
            duas: duasData.filter((d) => d.category_id === cat.id),
          }))
          .filter((group) => group.duas.length > 0);

        setCategories(groupedDuas);
      } catch (err) {
        console.error("Fetch error:", err);
        if (
          !isAuthenticated ||
          !err.message.includes("Authentication failed")
        ) {
          setError(
            err.message || "Could not load Duas. Check the backend service."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, AUTH_TOKEN, isAuthenticated]
  );

  useEffect(() => {
    fetchDuasAndCategories();
  }, [fetchDuasAndCategories]);

  const handleLocalToggle = (duaId) => {
    setLocalFavorites((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(duaId)) {
        newSet.delete(duaId);
      } else {
        newSet.add(duaId);
      }
      if (newSet.has(duaId)) {
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
      if (!res.ok) {
        throw new Error("Failed to toggle favorite status.");
      }

      const { favorites } = await res.json();

      const updateDua = (dua) => {
        if (dua.id === duaId) {
          const newIsFavorite = !dua.is_favorite;

          return {
            ...dua,
            is_favorite: newIsFavorite,
            favorite_count: favorites,
          };
        }
        return dua;
      };

      setAllDuas((prevDuas) => prevDuas.map(updateDua));
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

  const filteredCategories = categories
    .filter(
      (cat) => selectedCategory === "All" || cat.name === selectedCategory
    )
    .map((cat) => ({ ...cat, duas: cat.duas }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const allCategoryNames = ["All", ...Object.values(categoriesMap)];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-green-800 py-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-xl mx-auto text-center">
          <BookOpenCheck className="w-10 h-10 text-green-800 mx-auto mb-2" />
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, serif" }}
          >
            أدعية وأذكار
          </h1>
          <p className="text-lg text-green-800 font-light mt-1">
            Daily Supplications Collection
          </p>
        </div>
      </div>
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-xl mx-auto py-4 px-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Duas by title or text..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700 placeholder-gray-400 text-sm shadow-sm transition"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700 appearance-none cursor-pointer font-medium text-sm"
            >
              {allCategoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto py-8 space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">No duas found</p>
            <p className="text-gray-500 mt-2">
              Try a different search term or category filter.
            </p>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.name} className="bg-white p-4 rounded-lg shadow-md">
              <div className="mb-8 border-y border-emerald-500 py-2 bg-gray-50 -mx-4 px-4 sm:px-0">
                <h2 className="text-xl font-extrabold text-gray-800 tracking-tight pl-4">
                  {cat.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({cat.duas.length})
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-12">
                {cat.duas.map((dua, index) => (
                  <DuaItem
                    key={dua.id}
                    dua={dua}
                    index={index}
                    toggleFavorite={toggleFavorite}
                    isAuthenticated={isAuthenticated}
                    isLocallyFavorite={localFavorites.has(dua.id)}
                    handleLocalToggle={handleLocalToggle}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <footer className="text-green-800 py-6 mt-12 bg-white border-t border-gray-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-emerald-500 text-sm">
            May Allah accept our prayers and remembrance
          </p>
        </div>
      </footer>
    </div>
  );
}
