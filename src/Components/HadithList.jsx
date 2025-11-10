import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpenCheck,
  Loader2,
  Search,
  Filter,
  Heart,
  BookOpen,
  Tag,
  Eye,
} from "lucide-react";

const getAuthToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("access_token");
};

const redirectToLogin = () => {
  console.log("Redirecting user to login page...");
  console.log("Requirement: User must be logged in to save favorites.");
};

const HadithItem = ({
  hadith,
  index,
  toggleFavorite,
  isAuthenticated,
  isLocallyFavorite,
  handleLocalToggle,
  categoryMap,
}) => {
  const isFavorite = isAuthenticated
    ? hadith.is_favorite || false
    : isLocallyFavorite;

  const favoriteCount = hadith.favorite_count || 0;
  const viewCount = hadith.view_count || 0;

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      handleLocalToggle(hadith.id);
    } else {
      toggleFavorite(hadith.id);
    }
  };

  return (
    <article key={hadith.id} className="border-b border-gray-200 pb-8 px-4">
      <div className="mb-4 flex justify-between items-start">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase">
            Hadith #{hadith.number || index + 1}
          </span>
          <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            {hadith.book || "Unknown Book"}
          </h3>
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
            className="text-2xl text-right text-gray-900 leading-relaxed py-2 bg-gray-50 p-3 rounded-lg border border-gray-100"
            style={{
              fontFamily: "Amiri, 'Times New Roman', serif",
              lineHeight: "2.0",
            }}
          >
            {hadith.arabic}
          </p>
        </div>

        {hadith.translation && (
          <div className="p-3 border-l-4 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-700 mb-1 uppercase tracking-wide">
              Meaning
            </p>
            <p className="text-base text-gray-800 font-medium">
              {hadith.translation}
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-dashed border-gray-100 space-y-2 text-sm flex justify-between items-center">
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-emerald-600" />
              {categoryMap[hadith.category_id] || "Uncategorized"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-gray-500" />
              Narrator: {hadith.narrator || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-gray-500">
              <Eye className="w-4 h-4" />
              {viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <Heart className="w-4 h-4 fill-red-500" />
              {favoriteCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default function HadithViewer() {
  const [categories, setCategories] = useState([]);
  const [allHadiths, setAllHadiths] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [localFavorites, setLocalFavorites] = useState(new Set());
  const [page, setPage] = useState(1);
  const limit = 10;

  const API_BASE = "http://127.0.0.1:8000/api";
  const AUTH_TOKEN = getAuthToken();
  const isAuthenticated = !!AUTH_TOKEN;

  const buildFetchUrl = useCallback(
    (q, p, l) => {
      const params = new URLSearchParams({ page: p, limit: l });
      if (q) {
        params.append("q", q);
      }
      return `${API_BASE}/hadiths/paginated?${params.toString()}`;
    },
    [API_BASE]
  );

  const fetchHadithsAndCategories = useCallback(
    async (q = searchTerm, p = page) => {
      setLoading(true);
      setError(null);
      try {
        const fetchOptions = {
          headers: AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
        };

        const catRes = await fetch(`${API_BASE}/hadith-categories`);
        if (!catRes.ok) throw new Error("Failed to fetch categories.");
        const catData = await catRes.json();

        const catMap = catData.reduce((map, cat) => {
          map[cat.id] = cat.name;
          return map;
        }, {});
        setCategoriesMap(catMap);

        const url = buildFetchUrl(q, p, limit);
        const hadithsRes = await fetch(url, fetchOptions);

        if (hadithsRes.status === 401 && isAuthenticated) {
          redirectToLogin();
          throw new Error("Authentication failed. Redirecting to login.");
        }
        if (!hadithsRes.ok) throw new Error("Failed to fetch Hadiths.");

        let hadithsData = await hadithsRes.json();

        setAllHadiths(hadithsData);

        const groupedHadiths = catData
          .map((cat) => ({
            name: cat.name,
            id: cat.id,
            hadiths: hadithsData.filter((h) => h.category_id === cat.id),
          }))
          .filter((group) => group.hadiths.length > 0);

        setCategories(groupedHadiths);
      } catch (err) {
        console.error("Fetch error:", err);
        if (
          !isAuthenticated ||
          !err.message.includes("Authentication failed")
        ) {
          setError(
            err.message || "Could not load Hadiths. Check the backend service."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, AUTH_TOKEN, isAuthenticated, buildFetchUrl, searchTerm, page]
  );

  useEffect(() => {
    fetchHadithsAndCategories();
  }, [fetchHadithsAndCategories]);

  const handleLocalToggle = (hadithId) => {
    setLocalFavorites((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(hadithId)) {
        newSet.delete(hadithId);
      } else {
        newSet.add(hadithId);
      }
      if (newSet.has(hadithId)) {
        redirectToLogin();
      }
      return newSet;
    });
  };

  const toggleFavorite = async (hadithId) => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    const updateHadith = (hadith) => {
      if (hadith.id === hadithId) {
        const newIsFavorite = !hadith.is_favorite;
        return {
          ...hadith,
          is_favorite: newIsFavorite,
          favorite_count: hadith.favorite_count + (newIsFavorite ? 1 : -1),
        };
      }
      return hadith;
    };

    setAllHadiths((prevHadiths) => prevHadiths.map(updateHadith));
    setCategories((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        hadiths: group.hadiths.map(updateHadith),
      }))
    );

    try {
      const res = await fetch(
        `${API_BASE}/hadiths/${hadithId}/toggle-favorite`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        }
      );

      if (res.status === 401) {
        redirectToLogin();
        fetchHadithsAndCategories(searchTerm, page);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to toggle favorite status.");
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      fetchHadithsAndCategories(searchTerm, page);
      setError("Failed to update favorite status.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setPage(1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchHadithsAndCategories(searchTerm, 1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchHadithsAndCategories]);

  const filteredCategories = categories
    .filter(
      (cat) => selectedCategory === "All" || cat.name === selectedCategory
    )
    .map((cat) => ({ ...cat, hadiths: cat.hadiths }));

  const allCategoryNames = ["All", ...Object.values(categoriesMap)];

  const displayedHadiths =
    selectedCategory === "All" && filteredCategories.length > 0
      ? allHadiths
      : filteredCategories.flatMap((cat) => cat.hadiths);

  if (loading && allHadiths.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-green-800 py-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-xl mx-auto text-center">
          <BookOpenCheck className="w-10 h-10 text-green-800 mx-auto mb-2" />
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, serif" }}
          >
            أحاديث نبوية
          </h1>
          <p className="text-lg text-green-800 font-light mt-1">
            Prophetic Sayings and Teachings Collection
          </p>
        </div>
      </div>
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="max-w-xl mx-auto py-4 px-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Hadiths by text, book, or narrator..."
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
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-xl mx-auto">
            <p className="font-semibold">{error}</p>
            {!isAuthenticated && (
              <p className="text-sm mt-1">
                Note: You need to log in to save favorites.
              </p>
            )}
          </div>
        )}

        {displayedHadiths.length === 0 && !loading ? (
          <div className="text-center py-16 px-4">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 font-medium">
              No Hadiths found
            </p>
            <p className="text-gray-500 mt-2">
              Try a different search term or category filter.
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 gap-12">
              {displayedHadiths.map((hadith, index) => (
                <HadithItem
                  key={hadith.id}
                  hadith={hadith}
                  index={index}
                  toggleFavorite={toggleFavorite}
                  isAuthenticated={isAuthenticated}
                  isLocallyFavorite={localFavorites.has(hadith.id)}
                  handleLocalToggle={handleLocalToggle}
                  categoryMap={categoriesMap}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-[1000px] mx-auto py-4">
        <div className="flex justify-between items-center mt-4 px-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <span className="font-medium text-gray-700">Page {page}</span>
          <button
            disabled={loading || displayedHadiths.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      </div>

    </div>
  );
}
