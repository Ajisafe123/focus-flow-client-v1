import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ImageIcon, Newspaper, TrendingUp, Star, Bookmark } from "lucide-react";
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
    const href = `/article-category/${id}/${name
      .replace(/\s/g, "-")
      .toLowerCase()}`;

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

  const quickLinks = [
    { name: "Latest Articles", href: "/articles/latest", icon: Newspaper },
    { name: "Trending Now", href: "/articles/trending", icon: TrendingUp },
    { name: "Most Popular", href: "/articles/popular", icon: Star },
    { name: "Saved Articles", href: "/articles/saved", icon: Bookmark },
  ];

  if (loading) {
    return (
      <div className="absolute z-[80] top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-md shadow-2xl border border-gray-100 p-8 flex items-center justify-center h-56 pointer-events-auto">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (quickLinksOnly) {
    return (
      <div className="space-y-1">
        {quickLinks.map(({ name, href, icon: Icon }) => (
          <button
            key={name}
            onClick={() => {
              onQuickLinkClick?.(href);
              setIsArticleDropdownOpen(false);
            }}
            className="w-full text-left flex items-center pl-10 py-2 text-base text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
          >
            {Icon && <Icon className="w-4 h-4 mr-3 text-emerald-500" />}
            {name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute z-[80] top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-md shadow-2xl border border-emerald-100 pointer-events-auto">
      <div className="bg-white p-6">
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.slice(0, 4).map((cat) => (
            <Card
              key={cat.id}
              name={cat.name}
              id={cat.id}
              image_url={cat.image_url}
            />
          ))}
        </div>

        <div className="rounded-md p-4 shadow-sm border border-emerald-100 bg-white">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setIsArticleDropdownOpen(false)}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 text-left border border-transparent hover:border-emerald-200 group"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}
                >
                  <Icon className={`w-4 h-4 text-emerald-700`} />
                </div>
                <span className="text-gray-800 font-medium text-sm flex-1">
                  {name}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
