import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  Bell,
  User,
  ChevronDown,
  BookOpen,
  Mail,
  X,
  Settings,
  LogOut,
  Search,
  Video,
  Home,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Heart,
  Building,
  ShoppingCart,
  PackageOpen,
} from "lucide-react";
import DhikrDuaCardDropdown from "./DhikrDuaCardDropdown";
import TeachingResourceDropdown from "./TeachingResourcesCardDropdown";
import ArticleDropdown from "./ArticlesCardDropdown";

export default function Navigation({ setShowLogoutModal }) {
  const [activeLink, setActiveLink] = useState("Home");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDhikrDuaDropdownOpen, setIsDhikrDuaDropdownOpen] = useState(false);
  const [isTeachingDropdownOpen, setIsTeachingDropdownOpen] = useState(false);
  const [isArticleDropdownOpen, setIsArticleDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchBarRef = useRef(null);
  const dhikrDuaDropdownRef = useRef(null);
  const teachingDropdownRef = useRef(null);
  const articleDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const cartDropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const cartItemCount = 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target))
        setShowSearchBar(false);
      if (
        dhikrDuaDropdownRef.current &&
        !dhikrDuaDropdownRef.current.contains(e.target)
      )
        setIsDhikrDuaDropdownOpen(false);
      if (
        teachingDropdownRef.current &&
        !teachingDropdownRef.current.contains(e.target)
      )
        setIsTeachingDropdownOpen(false);
      if (
        articleDropdownRef.current &&
        !articleDropdownRef.current.contains(e.target)
      )
        setIsArticleDropdownOpen(false);
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(e.target)
      )
        setIsAboutDropdownOpen(false);
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      )
        setIsUserDropdownOpen(false);
      if (
        cartDropdownRef.current &&
        !cartDropdownRef.current.contains(e.target)
      )
        setIsCartHovered(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const pathToName = {
      "/": "Home",
      "/quran": "Quran",
      "/about": "About",
      "/contact": "About",
      "/prayer-times": "Prayer Times",
      "/profile": "Mine",
      "/login": "Mine",
      "/videos": "Videos",
      "/adhkar": "Dhikr & Du'a",
      "/dhikr-guide": "Dhikr & Du'a",
      "/duas": "Dhikr & Du'a",
      "/donation": "About",
      "/resources": "Teaching Resources",
      "/articles": "Articles",
    };
    setActiveLink(pathToName[location.pathname] || "");
  }, [location.pathname]);

  const handleNavItemClick = (href, name) => {
    navigate(href);
    setActiveLink(name);
  };

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

  const aboutMenuItems = [
    { name: "About Us", href: "/about", icon: Building },
    { name: "Contact Us", href: "/contact", icon: Mail },
    { name: "Donation", href: "/donation", icon: Heart },
  ];

  const socialLinks = [
    { id: "fb", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { id: "tw", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { id: "ig", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { id: "yt", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  const desktopMenuItems = [
    { name: "Home", href: "/" },
    { name: "Quran", href: "/quran" },
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
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative" ref={searchBarRef}>
                {!showSearchBar ? (
                  <button
                    onClick={() => setShowSearchBar(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-emerald-300 rounded-full hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <Search className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700" />
                    <span className="text-sm text-emerald-700 group-hover:text-emerald-800">
                      Search...
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 bg-white border-2 border-emerald-500 rounded-full px-4 py-2 shadow-lg transition-all">
                    <Search className="w-4 h-4 text-emerald-600" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                      placeholder="Search..."
                      className="w-64 focus:outline-none text-sm text-gray-800 placeholder-emerald-400"
                      autoFocus
                    />
                    <button
                      onClick={handleSearch}
                      className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchBar(false);
                        setSearchQuery("");
                      }}
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 px-3 py-1.5 bg-white rounded-full border border-emerald-200">
                <span className="text-xs font-medium text-emerald-700 mr-1">
                  Follow:
                </span>
                {socialLinks.map(({ id, icon: Icon, href, color }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-1.5 text-emerald-600 ${color} transition-colors rounded-full hover:bg-emerald-100`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
              <div className="h-6 w-px bg-emerald-300" />
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all group"
              >
                <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">+123 456 7890</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`hidden md:block fixed left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "top-12 bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-md shadow-2xl"
            : "top-12 bg-gradient-to-r from-emerald-800 to-teal-800 shadow-xl"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="text-white hover:text-amber-300 transition-colors group p-2 -ml-2"
            >
              <span className="block text-2xl font-extrabold tracking-tight group-hover:text-amber-300 transition-colors">
                Nibras Al-deen
              </span>
              <span className="block text-xs font-medium -mt-1 text-emerald-300 group-hover:text-amber-100 transition-colors">
                A Light of Guidance
              </span>
            </button>
            <div className="flex items-center space-x-6">
              {desktopMenuItems.map(({ name, href }) => (
                <button
                  key={name}
                  onClick={() => handleNavItemClick(href, name)}
                  className={`text-white hover:text-amber-300 transition-colors font-medium relative group ${
                    activeLink === name ? "text-amber-300" : ""
                  }`}
                >
                  {name}
                  <div
                    className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                      activeLink === name ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
              <div
                className="relative z-[60]"
                ref={dhikrDuaDropdownRef}
                onMouseEnter={() => setIsDhikrDuaDropdownOpen(true)}
                onMouseLeave={() => setIsDhikrDuaDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    handleNavItemClick("/duas", "Dhikr & Du'a");
                    setIsDhikrDuaDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 text-white hover:text-amber-300 transition-colors font-medium group relative ${
                    activeLink === "Dhikr & Du'a" ? "text-amber-300" : ""
                  }`}
                >
                  <span>Dhikr & Du'a</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDhikrDuaDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                      activeLink === "Dhikr & Du'a"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                {isDhikrDuaDropdownOpen && (
                  <DhikrDuaCardDropdown
                    handleNavItemClick={handleNavItemClick}
                    setIsDhikrDuaDropdownOpen={setIsDhikrDuaDropdownOpen}
                  />
                )}
              </div>
              <div
                className="relative z-[60]"
                ref={teachingDropdownRef}
                onMouseEnter={() => setIsTeachingDropdownOpen(true)}
                onMouseLeave={() => setIsTeachingDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    handleNavItemClick("/resources", "Teaching Resources");
                    setIsTeachingDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 text-white hover:text-amber-300 transition-colors font-medium group relative ${
                    activeLink === "Teaching Resources" ? "text-amber-300" : ""
                  }`}
                >
                  <span>Teaching Resources</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isTeachingDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                      activeLink === "Teaching Resources"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                {isTeachingDropdownOpen && (
                  <TeachingResourceDropdown
                    handleNavItemClick={handleNavItemClick}
                    setIsTeachingDropdownOpen={setIsTeachingDropdownOpen}
                  />
                )}
              </div>
              <div
                className="relative z-[60]"
                ref={articleDropdownRef}
                onMouseEnter={() => setIsArticleDropdownOpen(true)}
                onMouseLeave={() => setIsArticleDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    handleNavItemClick("/articles", "Articles");
                    setIsArticleDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 text-white hover:text-amber-300 transition-colors font-medium group relative ${
                    activeLink === "Articles" ? "text-amber-300" : ""
                  }`}
                >
                  <span>Articles</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isArticleDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                      activeLink === "Articles"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                {isArticleDropdownOpen && (
                  <ArticleDropdown
                    handleNavItemClick={handleNavItemClick}
                    setIsArticleDropdownOpen={setIsArticleDropdownOpen}
                  />
                )}
              </div>
              <div
                className="relative z-[60]"
                ref={aboutDropdownRef}
                onMouseEnter={() => setIsAboutDropdownOpen(true)}
                onMouseLeave={() => setIsAboutDropdownOpen(false)}
              >
                <button
                  onClick={() => setIsAboutDropdownOpen((p) => !p)}
                  className={`flex items-center space-x-1 text-white hover:text-amber-300 transition-colors font-medium group relative ${
                    activeLink === "About" ? "text-amber-300" : ""
                  }`}
                >
                  <span>About</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isAboutDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                      activeLink === "About"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                {isAboutDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-[60]">
                    <div className="py-2">
                      {aboutMenuItems.map(({ name, href, icon: Icon }) => (
                        <button
                          key={name}
                          onClick={() => {
                            handleNavItemClick(href, name);
                            setIsAboutDropdownOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-emerald-50 transition-colors text-sm"
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
              <div
                className="relative z-[60]"
                ref={cartDropdownRef}
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm relative"
                  onClick={() => setIsCartHovered((p) => !p)}
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {isCartHovered && cartItemCount === 0 && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 text-center z-[60]">
                    <PackageOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-gray-700">
                      No product in cart
                    </p>
                    <button
                      onClick={() => {
                        navigate("/shop");
                        setIsCartHovered(false);
                      }}
                      className="mt-3 w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Go to Shop
                    </button>
                  </div>
                )}
              </div>

              <div className="relative z-[60]" ref={userDropdownRef}>
                <button
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
                  onClick={() => setIsUserDropdownOpen((p) => !p)}
                >
                  <User className="w-5 h-5 text-white" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[60]">
                    {token ? (
                      <>
                        <button
                          onClick={() => handleUserAction("profile")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3 text-emerald-600" />
                          Profile
                        </button>
                        <button
                          onClick={() => handleUserAction("settings")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3 text-emerald-600" />
                          Settings
                        </button>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => handleUserAction("logout")}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Log Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate("/login")}
                        className="flex items-center w-full px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Login / Sign Up
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-700 to-teal-700 shadow-lg">
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="text-white hover:text-amber-300 transition-colors group p-1 -ml-1"
            >
              <span className="block text-xl font-extrabold tracking-tight group-hover:text-amber-300 transition-colors">
                Nibras Al-deen
              </span>
              <span className="block text-xs font-medium -mt-1 text-emerald-300 group-hover:text-amber-100 transition-colors">
                A Light of Guidance
              </span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearchBar((p) => !p)}
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
              >
                <Search className="w-5 h-5 text-white" />
              </button>

              <div className="relative z-[60]" ref={cartDropdownRef}>
                <button
                  className="p-2 rounded-full hover:bg-white/15 transition-colors relative"
                  onClick={() => setIsCartHovered((p) => !p)}
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {isCartHovered && cartItemCount === 0 && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-100 p-3 text-center z-[60] top-12">
                    <PackageOpen className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">
                      No product in cart
                    </p>
                    <button
                      onClick={() => {
                        navigate("/shop");
                        setIsCartHovered(false);
                      }}
                      className="mt-2 w-full py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Go to Shop
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden ${
              showSearchBar ? "max-h-16 pt-2 pb-4 px-4" : "max-h-0 p-0"
            }`}
          >
            <div className="flex items-center w-full space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Search resources, articles, and more..."
                className="flex-1 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/60 text-sm"
                autoFocus={showSearchBar}
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:pt-28 pt-16" />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
        <div className="flex items-center justify-around h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeLink === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavItemClick(item.href, item.name)}
                className="flex flex-col items-center justify-center flex-1 h-full"
              >
                <Icon
                  className={`w-6 h-6 mb-1 transition-all duration-200 ${
                    isActive ? "text-emerald-600 scale-110" : "text-gray-500"
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
                  <div className="w-8 h-1 bg-emerald-600 rounded-full mt-1 transition-all duration-200" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}