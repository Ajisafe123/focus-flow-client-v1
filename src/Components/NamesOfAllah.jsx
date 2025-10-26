import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, BookOpen, X } from "lucide-react";

export default function NamesOfAllah() {
  const [names, setNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllNames = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://focus-flow-server-v1.onrender.com/names/"
      );
      if (!response.ok) throw new Error("Failed to fetch all names");
      const data = await response.json();
      setNames(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load names. Check server connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllNames();
  }, [fetchAllNames]);

  useEffect(() => {
    if (searchTerm === "") return;

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://focus-flow-server-v1.onrender.com/names/search/?q=${searchTerm}`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        setNames(data);
      } catch (err) {
        console.error(err);
        setNames([]);
        setError("No matching names found.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchAllNames();
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center py-6 mb-8 border-b-2 border-yellow-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-3 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-1"
            style={{ fontFamily: "Amiri, serif" }}
          >
            الأسماء الحسنى
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            The 99 Beautiful Names of Allah
          </p>
        </header>

        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 bg-white text-gray-800 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 shadow-md transition-all text-base"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center focus:outline-none"
                aria-label="Clear Search"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-lg text-gray-600 font-medium">
              Loading Names...
            </p>
          </div>
        )}

        {error && !loading && (
          <p className="text-center text-xl text-red-500 font-semibold mt-8">
            {error}
          </p>
        )}

        {!loading && names.length > 0 && (
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            <div className="hidden lg:grid grid-cols-[80px_1fr_2fr] gap-4 bg-gray-50 text-gray-600 font-bold py-3 px-6 text-sm sticky top-0 z-10 border-b border-gray-200">
              <div className="text-right">#</div>
              <div className="text-right">Arabic Name</div>
              <div className="text-left">Transliteration & Meaning</div>
            </div>

            {names.map((name, index) => (
              <div
                key={name.id}
                className="grid grid-cols-1 lg:grid-cols-[80px_1fr_2fr] gap-4 items-center transition-colors hover:bg-yellow-50/50 p-4 lg:py-3 lg:px-6"
              >
                <div className="order-1 lg:order-1 text-lg font-semibold text-yellow-600 text-center lg:text-xl lg:text-right">
                  {index + 1}
                </div>

                <div className="order-2 lg:order-2 text-center lg:text-right">
                  <span className="lg:hidden text-sm font-semibold text-gray-500">
                    Arabic:{" "}
                  </span>
                  <p
                    className="text-4xl sm:text-5xl font-extrabold text-green-700 leading-tight"
                    style={{ fontFamily: "Amiri, serif" }}
                  >
                    {name.arabic}
                  </p>
                </div>

                <div className="order-3 lg:order-3 text-center lg:text-left pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                  <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-1">
                    {name.transliteration}
                  </p>
                  <p className="text-sm sm:text-base text-gray-600 italic">
                    {name.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && names.length === 0 && !error && (
          <div className="text-center py-20 bg-gray-50 rounded-xl shadow-lg mt-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
              <Search className="w-7 h-7 text-gray-500" />
            </div>
            <p className="text-lg text-gray-600 font-medium">
              No names found. Please check your spelling or clear the search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
