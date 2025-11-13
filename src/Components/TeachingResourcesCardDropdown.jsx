import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  Video,
  FileText,
  Headphones,
  Loader2,
  ChevronRight,
  GraduationCap,
  Users,
  Lightbulb,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

const TeachingResourceDropdown = ({
  handleNavItemClick,
  setIsTeachingDropdownOpen,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const catRes = await fetch(`${API_BASE}/teaching-categories`);
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
    "Quran Studies":
      "https://images.pexels.com/photos/1025469/pexels-photo-1025469.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Hadith Studies":
      "https://images.pexels.com/photos/5943880/pexels-photo-5943880.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Islamic History":
      "https://images.pexels.com/photos/2403209/pexels-photo-2403209.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Fiqh & Jurisprudence":
      "https://images.pexels.com/photos/4994726/pexels-photo-4994726.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Arabic Language":
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Islamic Ethics":
      "https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800",
  };

  const defaultImg =
    "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800";

  const Card = ({ name, id }) => {
    const categoryName = name.replace(/\s/g, "-").toLowerCase();
    const href = `/teaching-category/${id}/${categoryName}`;
    const img = images[name] || defaultImg;

    const handleClick = () => {
      handleNavItemClick(href, name);
      setIsTeachingDropdownOpen(false);
    };

    return (
      <button
        onClick={handleClick}
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
            <h3 className="text-white font-semibold text-base drop-shadow-lg tracking-tight">
              {name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 transition-all duration-300">
              <ChevronRight className="w-4 h-4 text-white transform translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </button>
    );
  };

  const quickLinks = [
    {
      name: "Lesson Plans",
      href: "/lesson-plans",
      icon: FileText,
      color: "emerald",
    },
    {
      name: "Video Lectures",
      href: "/video-lectures",
      icon: Video,
      color: "teal",
    },
    {
      name: "Audio Resources",
      href: "/audio-resources",
      icon: Headphones,
      color: "green",
    },
    {
      name: "Study Guides",
      href: "/study-guides",
      icon: BookOpen,
      color: "emerald",
    },
    {
      name: "Teaching Tools",
      href: "/teaching-tools",
      icon: Lightbulb,
      color: "teal",
    },
    { name: "Community Forum", href: "/forum", icon: Users, color: "emerald" },
  ];

  if (loading) {
    return (
      <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-[820px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 flex items-center justify-center h-56">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-3 w-[820px] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Teaching Resources
              </h3>
              <p className="text-sm text-gray-600">
                Comprehensive materials for educators
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleNavItemClick("/teaching-resources", "All Resources");
              setIsTeachingDropdownOpen(false);
            }}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {categories.slice(0, 6).map((cat) => (
            <Card key={cat.id} name={cat.name} id={cat.id} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Access
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {quickLinks.map(({ name, href, icon: Icon, color }) => (
              <button
                key={name}
                onClick={() => {
                  handleNavItemClick(href, name);
                  setIsTeachingDropdownOpen(false);
                }}
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
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingResourceDropdown;
