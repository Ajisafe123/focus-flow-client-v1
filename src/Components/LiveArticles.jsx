import React, { useState } from "react";
import { ArrowRight, BookOpenCheck } from "lucide-react";

export default function ArticleCategories() {
  const CATEGORIES = [
    {
      id: 1,
      name: "Faith & Beliefs",
      image_url:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400",
    },
    {
      id: 2,
      name: "Quran & Tafsir",
      image_url:
        "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400",
    },
    {
      id: 3,
      name: "Prophetic Guidance",
      image_url:
        "https://images.unsplash.com/photo-1584286595398-a59f21d75b4b?w=400",
    },
    {
      id: 4,
      name: "Islamic History",
      image_url:
        "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400",
    },
    {
      id: 5,
      name: "Spiritual Growth",
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 6,
      name: "Islamic Lifestyle",
      image_url:
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400",
    },
  ];

  const [categories] = useState(CATEGORIES);

  const handleCategoryClick = (categoryId) => {
    window.location.href = `/articles?category=${categoryId}`;
  };

  const handleViewAllArticlesClick = () => {
    window.location.href = `/articles`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 py-12 px-4 min-h-screen">
      <style>{`
        .horizontal-scroll::-webkit-scrollbar { height: 8px; }
        .horizontal-scroll::-webkit-scrollbar-thumb { background-color: #10b981; border-radius: 4px; }
        .horizontal-scroll::-webkit-scrollbar-thumb:hover { background-color: #059669; }
        .horizontal-scroll::-webkit-scrollbar-track { background-color: #f3f4f6; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-black">
            In-Depth <span className="text-emerald-600">Islamic Reading</span>
          </h1>
          <div className="w-24 h-1 mx-auto mt-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
        </div>

        <div
          className="flex space-x-6 overflow-x-scroll horizontal-scroll pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {categories.map((category) => {
            const imageUrl = category.image_url;
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

        <div className="flex justify-start mt-6">
          <button
            onClick={handleViewAllArticlesClick}
            className="inline-flex items-center text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors py-2 px-4 rounded-full border border-emerald-300 hover:bg-emerald-50"
          >
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}