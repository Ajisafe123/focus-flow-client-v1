import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ImageIcon, Newspaper, BookOpen, Lightbulb, Heart, Zap, Globe, Compass, Sparkles, Brain, Scroll, Feather } from "lucide-react";
import LoadingSpinner from "../../../Common/LoadingSpinner";
import { fetchArticleCategories, API_BASE_URL } from "../../../Users/Service/apiService";

const IMAGE_BASE = API_BASE_URL;

const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  let path = relativePath.trim();
  if (!path.startsWith("/static/")) path = `/static/article_images/${path}`;
  if (path.startsWith("//")) path = path.replace(/^\/+/, "/");
  return `${IMAGE_BASE}${path}`;
};

const iconList = [BookOpen, Lightbulb, Heart, Zap, Globe, Compass, Sparkles, Brain, Scroll, Feather, Newspaper];

const getIconForCategory = (index) => {
  return iconList[index % iconList.length];
};

export default function ArticleDropdown({
  setIsArticleDropdownOpen,
  quickLinksOnly = false,
  onQuickLinkClick,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchArticleCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load article categories", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const Card = ({ name, id, image_url }) => {
    const fullImageUrl = getFullImageUrl(image_url);
    const href = `/articles?category=${encodeURIComponent(name)}`;

    return (
      <Link
        to={href}
        onClick={() => setIsArticleDropdownOpen(false)}
        className="group w-full flex items-center bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 p-2 cursor-pointer"
      >
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={name}
              className="w-14 h-14 object-cover rounded-full"
              onError={(e) => (e.currentTarget.style.opacity = "0")}
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-emerald-600" />
          )}
        </div>
        <div className="ml-3 flex-1 text-left">
          <h3 className="text-gray-800 font-semibold text-base truncate">
            {name}
          </h3>
        </div>
        <ChevronRight className="w-5 h-5 text-emerald-600" />
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="absolute z-[80] top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-md shadow-2xl border border-gray-100 p-8 flex items-center justify-center h-56 pointer-events-auto">
        <LoadingSpinner />
      </div>
    );
  }

  if (quickLinksOnly) {
    return (
      <div className="space-y-1">
        {categories.map((cat, index) => {
          const IconComponent = getIconForCategory(index);
          return (
            <button
              key={cat.id}
              onClick={() => {
                onQuickLinkClick?.(`/articles?category=${encodeURIComponent(cat.name)}`);
                setIsArticleDropdownOpen(false);
              }}
              className="w-full text-left flex items-center pl-10 py-2 text-base text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
            >
              <IconComponent className="w-4 h-4 mr-3 text-emerald-500" />
              {cat.name}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="absolute z-[80] top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-md shadow-2xl border border-gray-100 p-8 pointer-events-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-emerald-600">Articles</h3>
          <p className="text-sm text-gray-600">
            Insights, reflections, and knowledge
          </p>
        </div>
        <Link
          to="/articles"
          onClick={() => setIsArticleDropdownOpen(false)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-md flex items-center gap-2 font-medium text-sm transition-all duration-200"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, index) => {
          const IconComponent = getIconForCategory(index);
          const fullImageUrl = getFullImageUrl(cat.image_url);

          return (
            <Link
              key={cat.id}
              to={`/articles?category=${encodeURIComponent(cat.name)}`}
              onClick={() => setIsArticleDropdownOpen(false)}
              className="group bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-xl p-5 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {fullImageUrl ? (
                    <img
                      src={fullImageUrl}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => (e.currentTarget.style.opacity = "0")}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center group-hover:from-emerald-200 group-hover:to-teal-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Browse articles</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
