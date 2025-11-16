import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  Clock,
  Heart,
  Loader2,
  ChevronRight,
  Newspaper,
  Bookmark,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

const ArticleDropdown = ({ setIsArticleDropdownOpen }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const catRes = await fetch(`${API_BASE}/article-categories`);
      if (!catRes.ok) throw new Error("Failed to fetch categories.");
      const catData = await catRes.json();
      setCategories(catData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const images = {
    "Faith & Spirituality":
      "https://images.pexels.com/photos/3394310/pexels-photo-3394310.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Islamic Lifestyle":
      "https://images.pexels.com/photos/4195325/pexels-photo-4195325.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Contemporary Issues":
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Family & Relationships":
      "https://images.pexels.com/photos/3791164/pexels-photo-3791164.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Science & Islam":
      "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800",
    "History & Heritage":
      "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  const defaultImg =
    "https://images.pexels.com/photos/261857/pexels-photo-261857.jpeg?auto=compress&cs=tinysrgb&w=800";

  const Card = ({ name, id }) => {
    const categoryName = name.replace(/\s/g, "-").toLowerCase();
    const href = `/article-category/${id}/${categoryName}`;
    const img = images[name] || defaultImg;

    return (
      <Link
        to={href}
        onClick={() => setIsArticleDropdownOpen(false)}
        className="group relative w-full bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 border border-gray-100 hover:border-emerald-300"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-800/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-400/10 to-emerald-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-lg drop-shadow-lg tracking-tight">
              {name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
              <ChevronRight className="w-4 h-4 text-white transform translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const quickLinks = [
    {
      name: "Latest Articles",
      href: "/articles/latest",
      icon: Clock,
      color: "emerald",
    },
    {
      name: "Trending Now",
      href: "/articles/trending",
      icon: TrendingUp,
      color: "teal",
    },
    {
      name: "Most Popular",
      href: "/articles/popular",
      icon: Heart,
      color: "green",
    },
    {
      name: "Saved Articles",
      href: "/articles/saved",
      icon: Bookmark,
      color: "emerald",
    },
  ];

  if (loading) {
    return (
      <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 flex items-center justify-center h-56">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Articles</h3>
              <p className="text-sm text-gray-600">
                Insights, reflections, and knowledge
              </p>
            </div>
          </div>
          <Link
            to="/articles"
            onClick={() => setIsArticleDropdownOpen(false)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.slice(0, 4).map((cat) => (
            <Card key={cat.id} name={cat.name} id={cat.id} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(({ name, href, icon: Icon, color }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setIsArticleDropdownOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 group text-left border border-transparent hover:border-emerald-200"
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
};

export default ArticleDropdown;
