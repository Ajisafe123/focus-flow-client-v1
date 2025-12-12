import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ImageIcon, BookOpen, Compass, Smartphone, Heart } from "lucide-react";
import LoadingSpinner from "../../../Components/Common/LoadingSpinner";
import apiService, { API_BASE_URL } from "../../Service/apiService";

const IMAGE_BASE = API_BASE_URL;

const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  let path = relativePath.trim();
  if (!path.startsWith("/static/")) path = `/static/category_images/${path}`;
  if (path.startsWith("//")) path = path.replace(/^\/+/, "/");
  return `${IMAGE_BASE}${path}`;
};

export default function DhikrDuaCardDropdown({
  setIsDhikrDuaDropdownOpen,
  quickLinksOnly = false,
  onQuickLinkClick,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getDuaCategories();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const Card = ({ name, id, imageUrl }) => {
    const fullImageUrl = getFullImageUrl(imageUrl);

    return (
      <Link
        to={{
          pathname: "/dua",
          search: `?category_id=${id}`,
        }}
        onClick={() => setIsDhikrDuaDropdownOpen(false)}
        className="group w-full flex items-center bg-white rounded-md shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-emerald-300 p-2 cursor-pointer"
      >
        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={name}
              className="w-14 h-14 object-cover rounded-full"
              onError={(e) => (e.target.style.opacity = "0")}
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

  const desiredIds = [5, 6, 7, 8];
  const filteredCategories = categories.filter((cat) =>
    desiredIds.includes(cat.id)
  );

  const getCategoryHrefByName = (name) => {
    const cat = categories.find((c) => c.name === name);
    if (cat) return { pathname: "/dua", search: `?category_id=${cat.id}` };
    return name.includes("Dhikr") ? "/dhikr-guide" : "/dua-guide";
  };

  const dhikrGuideHref = getCategoryHrefByName("Dhikr Guide");
  const duaGuideHref = getCategoryHrefByName("Du'a Guide");

  const quickLinks = [
    { name: "Read Adhkar", href: "/dua", icon: BookOpen },
    { name: "Dhikr Guide", href: dhikrGuideHref, icon: Compass },
    { name: "Du'a Guide", href: duaGuideHref, icon: Heart },
    { name: "Dhikr & Du'a App", href: "/app", icon: Smartphone },
  ];

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
        {quickLinks.map(({ name, href, icon: Icon }) => (
          <button
            key={name}
            onClick={() => {
              onQuickLinkClick?.(href);
              setIsDhikrDuaDropdownOpen(false);
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
            <h3 className="text-xl font-bold text-emerald-600">Dhikr & Du'a</h3>
            <p className="text-sm text-gray-600">
              Explore supplications and remembrance
            </p>
          </div>
          <Link
            to="/dua"
            onClick={() => setIsDhikrDuaDropdownOpen(false)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-md flex items-center gap-2 font-medium text-sm transition-all duration-200"
          >
            View All Duas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {filteredCategories.slice(0, 4).map((cat) => (
            <Card
              key={cat.id}
              name={cat.name}
              id={cat.id}
              imageUrl={cat.image_url}
            />
          ))}
        </div>

        <div className="bg-white rounded-md p-4 shadow-sm border border-emerald-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Links
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setIsDhikrDuaDropdownOpen(false)}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-200 text-left border border-transparent hover:border-emerald-200 group"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                  {Icon && <Icon className="w-4 h-4 text-emerald-700" />}
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
