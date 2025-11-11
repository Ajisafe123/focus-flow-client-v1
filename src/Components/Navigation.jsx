import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
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
  Search,
  Video,
  Info,
  Mail,
  X,
  Settings,
  LogOut,
} from "lucide-react";

export default function Navigation({ setShowLogoutModal }) {
  const [activeLink, setActiveLink] = useState("Home");
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isIslamicDropdownOpenDesktop, setIsIslamicDropdownOpenDesktop] =
    useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesDropdownRef = useRef(null);
  const searchBarRef = useRef(null);
  const islamicDropdownRefDesktop = useRef(null);
  const userDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      )
        setShowCategoriesDropdown(false);
      if (searchBarRef.current && !searchBarRef.current.contains(event.target))
        setShowSearchBar(false);
      if (
        islamicDropdownRefDesktop.current &&
        !islamicDropdownRefDesktop.current.contains(event.target)
      )
        setIsIslamicDropdownOpenDesktop(false);
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      )
        setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const pathToName = {
      "/": "Home",
      "/quran": "Quran",
      "/about": "About",
      "/contact": "Contact",
      "/prayer-times": "Prayer Times",
      "/profile": "Mine",
      "/login": "Mine",
      "/videos": "Videos",
      "/dua": "Dua",
      "/hadith": "Hadith",
      "/islamic-calendar": "Islamic Calendar",
      "/99-names": "99 Names of Allah",
      "/zakat-calculator": "Zakat Calculator",
      "/qibla-finder": "Qibla Finder",
      "/settings": "Settings",
    };
    setActiveLink(pathToName[location.pathname] || "");
  }, [location.pathname]);

  const handleNavItemClick = (href, name) => navigate(href);

  const handleUserAction = (action) => {
    if (action === "profile") navigate("/profile");
    else if (action === "settings") navigate("/settings");
    else if (action === "logout") setShowLogoutModal(true);
    setIsUserDropdownOpen(false);
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
    { name: "Quran", href: "/quran", icon: BookOpen },
    { name: "Dua", href: "/dua", icon: BookOpen },
    { name: "Hadith", href: "/hadith", icon: MessageCircle },
    { name: "Islamic Calendar", href: "/islamic-calendar", icon: Calendar },
    { name: "99 Names of Allah", href: "/99-names", icon: Star },
    { name: "Zakat Calculator", href: "/zakat-calculator", icon: Calculator },
    { name: "Qibla Finder", href: "/qibla-finder", icon: Compass },
  ];

  const desktopMenuItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Quran", href: "/quran", icon: BookOpen },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Prayer Times", href: "/prayer-times", icon: Clock },
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
              className="flex items-center transition-all duration-300 hover:scale-105 group space-x-2"
            >
              <span className="text-xl font-extrabold text-white leading-tight logo-nastaliq">
                Nibras Al-deen
              </span>
            </button>

            <div className="flex items-center space-x-8">
              {desktopMenuItems.map(({ name, href, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => handleNavItemClick(href, name)}
                  className={`relative text-white hover:text-amber-200 transition-colors duration-200 font-semibold pb-1 flex items-center space-x-2 ${
                    activeLink === name ? "text-amber-200" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
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
                  className={`relative text-white hover:text-amber-200 transition-colors duration-200 font-semibold pb-1 flex items-center space-x-2 ${
                    activeLink === "Resources" ? "text-amber-200" : ""
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Resources</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isIslamicDropdownOpenDesktop ? "rotate-180" : ""
                    }`}
                  />
                  {activeLink === "Resources" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-200" />
                  )}
                </button>
                {isIslamicDropdownOpenDesktop && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white w-64 rounded-md overflow-hidden shadow-lg transform transition-all duration-200">
                    <div className="bg-emerald-600 px-5 py-2">
                      <h3 className="text-white font-bold text-sm tracking-wide">
                        ISLAMIC RESOURCES
                      </h3>
                    </div>
                    <div className="py-1">
                      {islamicResources.map(({ name, href, icon: Icon }) => (
                        <button
                          key={name}
                          onClick={() => handleNavItemClick(href, name)}
                          className="flex items-center w-full px-5 py-2.5 text-gray-700 hover:bg-emerald-50 transition-all duration-200 group text-sm"
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

            <div className="flex items-center space-x-3">
              <div className="relative" ref={userDropdownRef}>
                <button
                  className="relative p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 shadow-md backdrop-blur-sm group border-2 border-transparent hover:border-amber-200"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                >
                  <User className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {token ? (
                      <>
                        <div className="p-2">
                          <button
                            onClick={() => handleUserAction("profile")}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            <User className="w-4 h-4 mr-3 text-emerald-600" />
                            Profile
                          </button>
                          <button
                            onClick={() => handleUserAction("settings")}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3 text-emerald-600" />
                            Settings
                          </button>
                        </div>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => handleUserAction("logout")}
                            className="flex items-center w-full px-3 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Log Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate("/login")}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Login / Sign Up
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button className="relative p-2.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 shadow-md backdrop-blur-sm group">
                <Bell className="w-5 h-5 text-white group-hover:scale-105 transition-transform" />
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
          {!showSearchBar ? (
            <>
              <button
                onClick={() => handleNavItemClick("/", "Home")}
                className="flex items-center space-x-2"
              >
                <span className="text-base font-bold text-white leading-tight">
                  Nibras Al-deen
                </span>
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSearchBar(true)}
                  className="p-2 rounded-full hover:bg-white/15 transition-colors backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
                <div className="relative" ref={categoriesDropdownRef}>
                  <button
                    onClick={() =>
                      setShowCategoriesDropdown(!showCategoriesDropdown)
                    }
                    className="px-3 py-2 rounded-full hover:bg-white/15 transition-colors backdrop-blur-sm flex items-center space-x-1 text-white text-sm font-semibold"
                  >
                    <span>More</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        showCategoriesDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showCategoriesDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                      <div className="bg-emerald-600 px-4 py-2">
                        <h3 className="text-white font-bold text-xs tracking-wide">
                          RESOURCES
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
                            className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Icon className="w-4 h-4 mr-3 text-emerald-600" />
                            <span>{name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate("/resources");
                            setShowCategoriesDropdown(false);
                          }}
                          className="text-emerald-600 font-semibold text-xs hover:text-emerald-700 transition-colors flex items-center"
                        >
                          <span>View All</span>
                          <ChevronDown className="w-3 h-3 ml-1 rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center w-full space-x-2">
              <form
                onSubmit={handleSearch}
                className="flex-1 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-white/15 text-white p-2 rounded-lg hover:bg-white/25 transition-colors backdrop-blur-sm"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
              <button
                onClick={() => {
                  setShowSearchBar(false);
                  setSearchQuery("");
                }}
                className="text-white font-medium text-sm p-2 rounded-full hover:bg-white/15 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:pt-16 pt-14" />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.1)] rounded-tl-xl rounded-tr-xl">
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
