import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Moon,
  Clock,
  Calendar,
  Bell,
  User,
  ChevronDown,
  BookOpen,
  MessageCircle,
  Calculator,
  Compass,
  Star,
  Home,
  Grid3x3,
  Search,
  Video,
} from "lucide-react";

export default function Navigation({ isLoggedIn, setShowLogoutModal }) {
  const [activeLink, setActiveLink] = useState("Home");
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isIslamicDropdownOpenDesktop, setIsIslamicDropdownOpenDesktop] =
    useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesDropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const islamicDropdownRefDesktop = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setShowCategoriesDropdown(false);
      }
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowSearchBar(false);
      }
      if (
        islamicDropdownRefDesktop.current &&
        !islamicDropdownRefDesktop.current.contains(event.target)
      ) {
        setIsIslamicDropdownOpenDesktop(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavItemClick = (href, name) => {
    setActiveLink(name);
    navigate(href);
  };

  const handleDropdownAction = (action) => {
    if (action === "profile") navigate("/profile");
    else if (action === "settings") navigate("/settings");
    else if (action === "logout") setShowLogoutModal(true);
    else if (action === "login") navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchBar(false);
      setSearchQuery("");
    }
  };

  const islamicResources = [
    { name: "Dua", href: "/dua", icon: BookOpen },
    { name: "Hadith", href: "/hadith", icon: MessageCircle },
    { name: "Islamic Calendar", href: "/islamic-calendar", icon: Calendar },
    { name: "99 Names of Allah", href: "/99-names", icon: Star },
    { name: "Zakat Calculator", href: "/zakat-calculator", icon: Calculator },
    { name: "Qibla Finder", href: "/qibla-finder", icon: Compass },
  ];

  const desktopMenuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Prayer Times", href: "/prayer-times" },
  ];

  const mobileNavItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Quran", icon: BookOpen, href: "/quran" },
    { name: "Prayer", icon: Clock, href: "/prayer-times" },
    { name: "Videos", icon: Video, href: "/videos" },
    { name: "Mine", icon: User, href: token ? "/profile" : "/login" },
  ];

  return (
    <>
      <nav
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-emerald-700/95 via-emerald-800/95 to-teal-800/95 backdrop-blur-md shadow-2xl"
            : "bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 group"
            >
              <div className="bg-white/15 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 shadow-lg">
                <Moon className="w-7 h-7 text-amber-200 group-hover:text-amber-100 transition-colors" />
              </div>
              <div>
                <span className="text-xl font-extrabold block text-white tracking-wider drop-shadow-lg">
                  NIBRAS AL-DEEN
                </span>
              </div>
            </button>

            <div className="flex items-center space-x-8">
              {desktopMenuItems.map(({ name, href }) => (
                <button
                  key={name}
                  onClick={() => handleNavItemClick(href, name)}
                  className={`relative text-white hover:text-amber-200 transition-colors duration-200 font-semibold pb-1 ${
                    activeLink === name ? "text-amber-200" : ""
                  }`}
                >
                  {name}
                  {activeLink === name && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-200" />
                  )}
                </button>
              ))}

              <div className="relative" ref={islamicDropdownRefDesktop}>
                <button
                  onClick={() =>
                    setIsIslamicDropdownOpenDesktop((prev) => !prev)
                  }
                  className={`flex items-center space-x-2 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 rounded-xl backdrop-blur-sm ${
                    isIslamicDropdownOpenDesktop
                      ? "bg-white/20"
                      : "hover:bg-white/15"
                  } group`}
                >
                  <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Resources</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isIslamicDropdownOpenDesktop ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isIslamicDropdownOpenDesktop && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white w-64 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-200">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
                      <h3 className="text-white font-bold text-sm tracking-wide">
                        ISLAMIC RESOURCES
                      </h3>
                    </div>
                    <div className="py-2">
                      {islamicResources.map(({ name, href, icon: Icon }) => (
                        <button
                          key={name}
                          onClick={() => handleNavItemClick(href, name)}
                          className="flex items-center w-full px-5 py-3.5 text-emerald-800 font-medium hover:bg-emerald-50 transition-all duration-200 group"
                        >
                          <Icon className="w-5 h-5 mr-3 text-emerald-600 group-hover:text-teal-600 transition-colors" />
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavItemClick("/contact", "Contact")}
                className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </button>
              <button className="relative p-2.5 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm group">
                <Bell className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center font-bold rounded-full shadow-lg">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-lg">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => handleNavItemClick("/", "Home")}
            className="flex items-center space-x-2"
          >
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Moon className="w-4 h-4 text-amber-200" />
            </div>
            <span className="text-lg font-bold text-white">NIBRAS AL-DEEN</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative" ref={searchBarRef}>
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="p-2 rounded-full hover:bg-white/15 transition-colors backdrop-blur-sm"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
              {showSearchBar && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <form onSubmit={handleSearch} className="p-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            <div className="relative" ref={categoriesDropdownRef}>
              <button
                onClick={() =>
                  setShowCategoriesDropdown(!showCategoriesDropdown)
                }
                className="p-2 rounded-full hover:bg-white/15 transition-colors backdrop-blur-sm"
              >
                <Grid3x3 className="w-5 h-5 text-white" />
              </button>
              {showCategoriesDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
                    <h3 className="text-white font-bold text-xs tracking-wide">
                      ISLAMIC RESOURCES
                    </h3>
                  </div>
                  <div className="py-1">
                    {islamicResources.map(({ name, href, icon: Icon }) => (
                      <button
                        key={name}
                        onClick={() => {
                          handleNavItemClick(href, name);
                          setShowCategoriesDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        <Icon className="w-4 h-4 mr-3 text-emerald-600" />
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 shadow-2xl">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item.href, item.name)}
                className="flex flex-col items-center justify-center flex-1 h-full relative group"
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={`text-xs font-medium transition-all duration-200 ${
                    isActive ? "text-emerald-600" : "text-gray-500"
                  }`}
                >
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-emerald-600 rounded-b-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
