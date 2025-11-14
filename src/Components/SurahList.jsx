import React, { useState, useEffect, useCallback } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

const API_BASE_URL = "https://focus-flow-server-v1.onrender.com";
const HISTORY_KEY = "quran_history";

const getHistory = () => {
  const historyString = localStorage.getItem(HISTORY_KEY);
  return historyString ? JSON.parse(historyString) : [];
};

const saveHistory = (surah) => {
  let history = getHistory();
  const now = new Date().getTime();

  history = history.filter((item) => item.id !== surah.id);

  history.unshift({
    id: surah.id,
    name_simple: surah.name_simple,
    name_arabic: surah.name_arabic,
    timestamp: now,
    page: surah.pages[0],
  });

  history = history.slice(0, 5);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
};

const SurahItem = ({ surah, onClick }) => {
  const handleSelect = () => {
    saveHistory(surah);
    onClick(surah.pages[0]);
  };

  return (
    <button
      key={surah.id}
      onClick={handleSelect}
      className="bg-emerald-900 border border-emerald-800 rounded-lg p-2 hover:bg-emerald-800 hover:border-green-500 transition duration-200 text-left group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-800 rounded-lg flex items-center justify-center text-gray-300 font-bold text-xs sm:text-sm border border-emerald-700 group-hover:bg-emerald-700 group-hover:border-green-700 transition flex-shrink-0">
            {surah.id}
          </div>
          <div>
            <h3 className="text-gray-100 font-semibold text-sm truncate">
              {surah.name_simple}
            </h3>
            <p className="text-gray-300 text-xs truncate">
              {surah.translated_name?.name || surah.name_complex}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {surah.verses_count} Ayahs | Page {surah.pages[0]}
            </p>
          </div>
        </div>
        <div
          className="text-lg text-gray-300 group-hover:text-green-400 transition flex-shrink-0"
          style={{ fontFamily: "Amiri, serif" }}
        >
          {surah.name_arabic}
        </div>
      </div>
    </button>
  );
};

const SurahList = ({ onSelectSurah }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("surah");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [history, setHistory] = useState(getHistory());

  const fetchSurahs = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/quran/surahs`);

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setSurahs(data);
      setHistory(getHistory());
    } catch (err) {
      setError(
        `Failed to load Surah list: ${err.message}. Check if your backend server is running on ${API_BASE_URL}.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurahs();
  }, [fetchSurahs]);

  const sortedSurahs = [...surahs].sort((a, b) => {
    let compare = a.id - b.id;

    if (activeTab === "revelation") {
      compare = a.revelation_order - b.revelation_order;
    }

    return sortOrder === "ascending" ? compare : -compare;
  });

  const handleSelectSurah = (surahPageNumber) => {
    onSelectSurah(surahPageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-700"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 text-lg text-red-400 bg-red-900/20 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {history.length > 0 && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-black-700 mb-4 flex items-center space-x-2">
            <Clock size={20} className="text-green-400" />
            <span className="text-gray-800">Recently Opened</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {history.map((surah) => {
              const fullSurah = surahs.find((s) => s.id === surah.id);
              if (!fullSurah) return null;

              return (
                <SurahItem
                  key={`history-${surah.id}`}
                  surah={fullSurah}
                  onClick={handleSelectSurah}
                />
              );
            })}
          </div>
          <hr className="my-8 border-emerald-700" />
        </>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between items-left mb-6 space-y-4 sm:space-y-0">
        <div className="flex space-x-1 bg-emerald-900 p-1 rounded-lg border border-emerald-800 justify-start sm:flex-nowrap">
          <button
            onClick={() => setActiveTab("surah")}
            className={`flex-1 px-3 py-1.5 sm:px-4 rounded-md transition text-xs sm:text-sm ${
              activeTab === "surah"
                ? "bg-emerald-800 text-green-400"
                : "text-gray-400 hover:text-green-200"
            }`}
          >
            Surah Order
          </button>
          <button
            onClick={() => setActiveTab("juz")}
            className={`flex-1 px-3 py-1.5 sm:px-4 rounded-md transition text-xs sm:text-sm ${
              activeTab === "juz"
                ? "bg-emerald-800 text-green-400"
                : "text-gray-400 hover:text-green-200"
            }`}
          >
            Juz Order
          </button>
          <button
            onClick={() => setActiveTab("revelation")}
            className={`flex-1 px-3 py-1.5 sm:px-4 rounded-md transition text-xs sm:text-sm ${
              activeTab === "revelation"
                ? "bg-emerald-800 text-green-400"
                : "text-gray-400 hover:text-green-200"
            }`}
          >
            Revelation Order
          </button>
        </div>

        <button
          onClick={() =>
            setSortOrder(sortOrder === "ascending" ? "descending" : "ascending")
          }
          className="text-xs text-gray-800 hover:text-gray-200 transition flex items-center space-x-2"
        >
          <span className="text-gray-800 font-extrabold">SORT BY:</span>
          <span className="text-gray-800 font-semibold uppercase">
            {sortOrder}
          </span>
          {sortOrder === "ascending" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedSurahs.map((surah) => (
          <SurahItem key={surah.id} surah={surah} onClick={handleSelectSurah} />
        ))}
      </div>
    </div>
  );
};

export default SurahList;
