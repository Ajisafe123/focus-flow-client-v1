import React, { useEffect, useState } from "react";
import { BookOpenCheck, Loader2, Search } from "lucide-react";

export default function HadithViewer() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const limit = 10;
  const BASE_URL = "http://127.0.0.1:8000/hadiths";

  useEffect(() => {
    const fetchHadiths = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = query
          ? `${BASE_URL}/search?q=${encodeURIComponent(
              query
            )}&page=${page}&limit=${limit}`
          : `${BASE_URL}?page=${page}&limit=${limit}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setHadiths(data);
      } catch {
        setError("Could not load Hadiths. Please check the backend service.");
      } finally {
        setLoading(false);
      }
    };

    fetchHadiths();
  }, [query, page]);

  return (
    <div className="min-h-screen">
      <div className="text-green-800 py-10 border-b border-gray-200">
        <div className="max-w-xl mx-auto text-center">
          <BookOpenCheck className="w-10 h-10 text-green-800 mx-auto mb-2" />
          <h1
            className="text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "Amiri, serif" }}
          >
            أحاديث نبوية
          </h1>
          <p className="text-lg text-green-800 font-light mt-1">
            Prophetic Sayings and Teachings
          </p>
        </div>
      </div>

      <div className="sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-xl mx-auto py-4 px-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Hadiths..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-gray-700 placeholder-gray-400 text-sm shadow-sm transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto py-8 space-y-10">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-center font-semibold">{error}</p>
        )}

        {!loading && !error && hadiths.length > 0 && (
          <div className="space-y-10">
            {hadiths.map((h, index) => (
              <div key={h.id} className="border-b border-gray-200 pb-8 px-4">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Hadith #{index + 1}
                  </h3>
                </div>

                <p
                  className="text-2xl text-right text-gray-900 leading-relaxed py-2"
                  style={{ fontFamily: "Amiri, serif", lineHeight: "2.0" }}
                >
                  {h.arabic}
                </p>

                {h.english?.transliteration && (
                  <div className="text-base text-gray-600 italic border-l-4 border-gray-300 pl-3 mb-2">
                    {h.english.transliteration}
                  </div>
                )}

                {h.english?.translation && (
                  <div className="p-3 border-l-4 border-emerald-500">
                    {h.english.translation}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    {h.category}
                  </span>
                  <span>{h.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && hadiths.length === 0 && (
          <p className="text-center text-gray-600">No hadiths found.</p>
        )}

        <div className="flex justify-between items-center mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-medium">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
