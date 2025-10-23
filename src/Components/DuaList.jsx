import React, { useState, useEffect } from "react";
import {
  BookOpenCheck,
  Loader2,
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
} from "lucide-react";

export default function DuaApp() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const BASE_URL = "http://127.0.0.1:8000/duas/";

  useEffect(() => {
    fetchDuas();
  }, []);

  const fetchDuas = async (q = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = q ? `${BASE_URL}search?q=${encodeURIComponent(q)}` : BASE_URL;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const cats = Array.from(new Set(data.map((d) => d.category))).map(
        (c) => ({
          name: c,
          duas: data.filter((d) => d.category === c),
        })
      );
      setCategories(cats);
    } catch {
      setError("Could not load Duas. Please check the backend service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchDuas(e.target.value);
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 max-w-md text-center border-2 border-red-500 rounded-lg">
          <p className="text-red-700 font-semibold text-lg">{error}</p>
          <button
            onClick={() => fetchDuas()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const allCategoryNames = ["All", ...categories.map((c) => c.name)];

  return (
    <div className="min-h-screen">
      <div className="text-green-800 py-10 border-b border-gray-200">
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

      <div className="sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-xl mx-auto py-4 px-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Duas..."
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
            <div key={cat.name}>
              <div className="mb-8 border-y border-emerald-500 py-2">
                <h2 className="text-xl font-extrabold text-gray-800 tracking-tight pl-4">
                  {cat.name}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({cat.duas.length})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {cat.duas.map((dua, index) => (
                  <article
                    key={dua.id}
                    className="border-b border-gray-200 pb-8 px-4"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-600 uppercase">
                        Dua #{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">
                        {dua.title}
                      </h3>
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
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="text-green-800 py-6 mt-12">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-emerald-300 text-sm">
            May Allah accept our prayers and remembrance
          </p>
        </div>
      </footer>
    </div>
  );
}
