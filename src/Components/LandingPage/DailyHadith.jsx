import React, { useEffect, useState, useCallback } from "react";
import { BookOpen, BookOpenCheck, ArrowRight } from "lucide-react";
import apiService from "../Service/apiService";

const DEMO_CATEGORIES = [
  { id: 1, name: "Worship (Salah, Fasting)", image_url: "worship.jpg" },
  { id: 2, name: "Daily Life (Eating, Sleeping)", image_url: "daily_life.jpg" },
  { id: 3, name: "Aqidah (Creed)", image_url: "aqidah.jpg" },
  { id: 4, name: "Manners (Adab)", image_url: "manners.jpg" },
  { id: 7, name: "Rulings (Fiqh)", image_url: "rulings.jpg" },
  { id: 8, name: "Prophet's Biography (Seerah)", image_url: "seerah.jpg" },
];

const STATIC_BASE_URL = "http://localhost:8000";

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
  return `${STATIC_BASE_URL}${path}`;
};

export default function DailyHadith() {
  const [hadith, setHadith] = useState(null);
  const [categories] = useState(DEMO_CATEGORIES);

  const fetchHadith = async () => {
    try {
      const data = await apiService.getDailyHadith();
      setHadith(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHadith();
  }, []);

  const handleCategoryClick = useCallback((categoryId) => {
    // This action would now link to a page showing hadith by category
    console.log(`Navigating to /hadith?category=${categoryId}`);
  }, []);

  const handleViewAllHadithClick = useCallback(() => {
    console.log("Navigating to /hadith");
  }, []);

  if (!hadith) {
    return (
      <div className="bg-gradient-to-b from-teal-50 to-emerald-50 py-12 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-600">
            <p className="text-center text-gray-500">Loading Hadith...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-12 px-4 min-h-screen">
      <style>{`
        .horizontal-scroll::-webkit-scrollbar { height: 8px; }
        .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 4px; }
        .horizontal-scroll::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .horizontal-scroll::-webkit-scrollbar-track { background-color: #f3f4f6; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-600">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Hadith of the Day
                </h2>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-4">
              <p className="text-gray-800 text-lg leading-relaxed mb-4 italic text-right">
                "{hadith.arabic}"
              </p>
              <p className="text-gray-700 text-md leading-relaxed mb-4">
                "{hadith.translation}"
              </p>
              {hadith.benefit && (
                <p className="text-green-700 text-sm leading-relaxed mb-4 font-medium">
                  Benefit: {hadith.benefit}
                </p>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-emerald-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Narrated by:</span>{" "}
                  {hadith.narrator}
                </p>
                <p className="text-sm text-emerald-700 font-semibold">
                  {hadith.book || hadith.source}
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-1.5">
              <div className="h-1.5 w-8 rounded-full bg-emerald-600" />
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
              Explore More{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Hadith Categories
              </span>
            </h3>
            <p className="text-gray-600 text-base max-w-xl mx-auto">
              Discover narrations from the Prophet (peace be upon him) by topic.
            </p>
          </div>

          <div
            className="flex space-x-6 overflow-x-scroll horizontal-scroll pb-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((category) => {
              const imageUrl = getFullImageUrl(category.image_url);
              return (
                <div
                  key={category.id}
                  className="flex-none w-48 group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative h-32 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add(
                            "flex",
                            "items-center",
                            "justify-center"
                          );
                          e.target.parentElement.innerHTML = `<svg class="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m-3-3h6m-6-4h6m-6-4h6m-9.45-3.45a2 2 0 012.828 0L12 5.05l2.622-2.622a2 2 0 012.828 0m-2.828 0a2 2 0 00-2.828 0m0 0l-2.622 2.622L12 7.078l2.622-2.622z"></path></svg>`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpenCheck className="w-12 h-12 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-gray-800 text-center group-hover:text-emerald-600 transition-colors mb-3 line-clamp-2">
                      {category.name}
                    </h4>
                    <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold py-2 px-3 rounded-full hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-1 shadow-md">
                      View
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleViewAllHadithClick}
              className="inline-flex items-center text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-2 px-4 rounded-full border border-emerald-300 hover:bg-emerald-50"
            >
              View All Hadith
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
