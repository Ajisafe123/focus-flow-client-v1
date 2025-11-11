import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "https://focus-flow-server-v1.onrender.com";

const SurahList = ({ onSelectSurah }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("surah");

  const fetchSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/quran/surahs`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! Status: ${response.status}`
        );
      }

      const data = await response.json();
      setSurahs(data);
    } catch (err) {
      setError(`Failed to load Surah list: ${err.message}. Check your API.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  const getJuzForSurah = (surahId) => {
    if (surahId === 1) return 1;
    if (surahId === 2) return 1;
    if (surahId === 3) return 3;
    if (surahId === 4) return 4;
    if (surahId === 5) return 6;
    if (surahId === 6) return 7;
    return Math.ceil(surahId / 4);
  };

  const groupedByJuz = surahs.reduce((acc, surah) => {
    const juz = getJuzForSurah(surah.id);
    if (!acc[juz]) acc[juz] = [];
    acc[juz].push(surah);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        /* Define the custom Arabic font class as requested */
        .font-serif-arabic {
          font-family: "Amiri", "Traditional Arabic", "Scheherazade", serif;
        }
      `}</style>

      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("surah")}
            className={`header-text flex-1 py-3 text-center font-medium transition ${
              activeTab === "surah"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Surah
          </button>
          <button
            onClick={() => setActiveTab("juz")}
            className={`header-text flex-1 py-3 text-center font-medium transition ${
              activeTab === "juz"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Juz
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`header-text flex-1 py-3 text-center font-medium transition ${
              activeTab === "favorites"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      <div className="pb-20">
        {activeTab === "surah" && (
          <div>
            {Object.entries(groupedByJuz)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([juz, surahsInJuz]) => (
                <div key={juz}>
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                    <span className="text-sm text-gray-500">Juz {juz}</span>
                    <span className="text-sm text-gray-400">
                      {surahsInJuz.reduce((sum, s) => sum + s.verses_count, 0)}
                    </span>
                  </div>

                  {surahsInJuz.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => onSelectSurah(surah.id)}
                      className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded text-sm font-medium">
                          {surah.id}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            {surah.name_simple}
                            <span className="text-xs text-gray-400">
                              {surah.revelation_place === "makkah" ? "۞" : ""}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {surah.revelation_place === "makkah"
                              ? "Meccan"
                              : "Medinan"}{" "}
                            - {surah.verses_count} Ayahs
                          </div>
                        </div>
                      </div>
                      <div
                        className="text-3xl sm:text-4xl font-extrabold text-green-700 leading-tight"
                        style={{ fontFamily: "Amiri, serif" }}
                      >
                        {surah.name_arabic}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
          </div>
        )}

        {activeTab === "juz" && (
          <div className="p-4 text-center text-gray-500">
            Juz view coming soon
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="p-4 text-center text-gray-500">No favorites yet</div>
        )}
      </div>
    </div>
  );
};

export default SurahList;
