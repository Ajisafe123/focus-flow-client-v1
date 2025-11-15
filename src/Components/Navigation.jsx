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
  Calendar,
  Menu,
  Layers,
  FileText,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasNewNotifications, setHasNewNotifications] = useState(true);

  const searchBarRef = useRef(null);
  const dhikrDuaDropdownRef = useRef(null);
  const teachingDropdownRef = useRef(null);
  const articleDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const cartItemCount = 3;

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
        !dhikrDuaDropdownRef.current.contains(e.target) &&
        !dhikrDuaDropdownRef.current.querySelector("button").contains(e.target)
      )
        setIsDhikrDuaDropdownOpen(false);
      if (
        teachingDropdownRef.current &&
        !teachingDropdownRef.current.contains(e.target) &&
        !teachingDropdownRef.current.querySelector("button").contains(e.target)
      )
        setIsTeachingDropdownOpen(false);
      if (
        articleDropdownRef.current &&
        !articleDropdownRef.current.contains(e.target) &&
        !articleDropdownRef.current.querySelector("button").contains(e.target)
      )
        setIsArticleDropdownOpen(false);
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(e.target) &&
        !aboutDropdownRef.current.querySelector("button").contains(e.target)
      )
        setIsAboutDropdownOpen(false);
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      )
        setIsUserDropdownOpen(false);

      const mobileMenuButton = document.querySelector("#mobile-menu-button");
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        e.target !== mobileMenuButton &&
        !mobileMenuButton.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    closeAllDropdowns();

    const pathToName = {
      "/": "Home",
      "/quran": "Quran",
      "/about": "About",
      "/contact": "About",
      "/donation": "About",
      "/prayer-times": "Prayer",
      "/profile": "Mine",
      "/login": "Mine",
      "/duas": "Dhikr & Du'a",
      "/hadith": "Dhikr & Du'a",
      "/99-names": "Dhikr & Du'a",
      "/zakat-calculator": "Dhikr & Du'a",
      "/qibla-finder": "Dhikr & Du'a",
      "/islamic-calendar": "Ramadan",
      "/ramadan": "Ramadan",
      "/articles": "Articles",
      "/teaching-resources": "Resources",
      "/lesson-plans": "Teaching Resources",
      "/audio-resources": "Teaching Resources",
      "/study-guides": "Teaching Resources",
      "/shop": "Shop",
      "/videos": "Videos",
      "/notifications": "Notifications",
    };
    const currentPath = location.pathname;
    let activeName = pathToName[currentPath] || "";

    if (currentPath.startsWith("/dua-category")) {
      activeName = "Dhikr & Du'a";
    }

    if (activeName === "Prayer Times") activeName = "Prayer";
    if (activeName === "Teaching Resources") activeName = "Resources";
    if (activeName === "About" && currentPath === "/donation")
      activeName = "Donation";

    setActiveLink(activeName);
  }, [location.pathname]);

  const handleNavItemClick = (href, name) => {
    navigate(href);
    setActiveLink(name);
    setIsMobileMenuOpen(false);
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
      setIsMobileMenuOpen(false);
    }
  };

  const handleNotificationClick = () => {
    navigate("/notifications");
    setActiveLink("Notifications");
    setHasNewNotifications(false);
    setIsMobileMenuOpen(false);
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
    { name: "Quran", href: "/quran", mobileIcon: BookOpen },
    { name: "Prayer Times", href: "/prayer-times" },
    {
      name: "Dhikr & Du'a",
      href: "/duas",
      dropdown: true,
      state: isDhikrDuaDropdownOpen,
      setState: setIsDhikrDuaDropdownOpen,
      ref: dhikrDuaDropdownRef,
      component: DhikrDuaCardDropdown,
      mobileIcon: Layers,
    },
    {
      name: "Teaching Resources",
      href: "/teaching-resources",
      dropdown: true,
      state: isTeachingDropdownOpen,
      setState: setIsTeachingDropdownOpen,
      ref: teachingDropdownRef,
      component: TeachingResourceDropdown,
      mobileIcon: PackageOpen,
    },
    {
      name: "Articles",
      href: "/articles",
      dropdown: true,
      state: isArticleDropdownOpen,
      setState: setIsArticleDropdownOpen,
      ref: articleDropdownRef,
      component: ArticleDropdown,
      mobileIcon: FileText,
    },
    {
      name: "About",
      href: "/about",
      dropdown: true,
      state: isAboutDropdownOpen,
      setState: setIsAboutDropdownOpen,
      ref: aboutDropdownRef,
      items: aboutMenuItems,
      mobileIcon: Building,
    },
  ];

  const mobileNavItems = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Quran", icon: BookOpen, href: "/quran" },
    { name: "Prayer", icon: Clock, href: "/prayer-times" },
    { name: "Ramadan", icon: Calendar, href: "/ramadan" },
    { name: "Mine", icon: User, href: token ? "/profile" : "/login" },
  ];

  const goToShop = () => {
    handleNavItemClick("/shop", "Shop");
  };

  const closeAllDropdowns = () => {
    setIsDhikrDuaDropdownOpen(false);
    setIsTeachingDropdownOpen(false);
    setIsArticleDropdownOpen(false);
    setIsAboutDropdownOpen(false);
  };

  const toggleDropdown = (setState) => (e) => {
    e.stopPropagation();
    closeAllDropdowns();
    setState(true);
  };

  const handleDropdownItemClick = (href, name, closeDropdown) => {
    handleNavItemClick(href, name);
    if (closeDropdown) {
      closeDropdown(false);
    }
    closeAllDropdowns();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((p) => !p);
  };

  const [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen] = useState(false);
  const [isMobileTeachingOpen, setIsMobileTeachingOpen] = useState(false);
  const [isMobileArticleOpen, setIsMobileArticleOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

  const mobileDropdownStates = {
    "Dhikr & Du'a": [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen],
    "Teaching Resources": [isMobileTeachingOpen, setIsMobileTeachingOpen],
    Articles: [isMobileArticleOpen, setIsMobileArticleOpen],
    About: [isMobileAboutOpen, setIsMobileAboutOpen],
  };

  const toggleMobileDropdown = (name) => {
    const [state, setState] = mobileDropdownStates[name];

    Object.keys(mobileDropdownStates).forEach((key) => {
      if (key !== name) {
        mobileDropdownStates[key][1](false);
      }
    });

    setState(!state);
  };

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
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center space-x-2 bg-white border-2 border-emerald-500 rounded-full px-4 py-2 shadow-lg transition-all">
                      <Search className="w-4 h-4 text-emerald-600" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-64 focus:outline-none text-sm text-gray-800 placeholder-emerald-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSearchBar(false);
                          setSearchQuery("");
                        }}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
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

            <div className="flex items-center flex-wrap justify-end space-x-4 lg:space-x-6">
              {desktopMenuItems.map((item) => {
                if (item.dropdown) {
                  const DropdownComponent = item.component;
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      ref={item.ref}
                      onMouseEnter={toggleDropdown(item.setState)}
                      onMouseLeave={() => item.setState(false)}
                    >
                      <button
                        onClick={() => {
                          handleNavItemClick(item.href, item.name);
                          item.setState(false);
                        }}
                        className={`flex items-center text-white hover:text-amber-300 transition-colors font-medium relative group p-2 whitespace-nowrap ${
                          item.state || activeLink === item.name
                            ? "text-amber-300"
                            : ""
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            item.state ? "rotate-180" : ""
                          }`}
                        />
                        <div
                          className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                            activeLink === item.name
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </button>
                      {item.state && (
                        <div className="absolute top-full mt-2 right-0 z-50 w-64 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {DropdownComponent ? (
                            <DropdownComponent
                              onItemClick={(href) => {
                                handleDropdownItemClick(
                                  href,
                                  item.name,
                                  item.setState
                                );
                              }}
                            />
                          ) : (
                            <div className="p-2">
                              {item.items.map((subItem) => (
                                <button
                                  key={subItem.name}
                                  onClick={() =>
                                    handleDropdownItemClick(
                                      subItem.href,
                                      subItem.name,
                                      item.setState
                                    )
                                  }
                                  className="w-full text-left flex items-center p-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 rounded-md transition-colors"
                                >
                                  <subItem.icon className="w-4 h-4 mr-3" />
                                  {subItem.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavItemClick(item.href, item.name)}
                      className={`text-white hover:text-amber-300 transition-colors font-medium relative group p-2 whitespace-nowrap ${
                        activeLink === item.name ? "text-amber-300" : ""
                      }`}
                    >
                      {item.name}
                      <div
                        className={`h-0.5 bg-amber-300 absolute inset-x-0 bottom-0 transition-all duration-300 ${
                          activeLink === item.name
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </button>
                  );
                }
              })}
            </div>

            <div className="flex items-center space-x-3">
              <div
                className="relative"
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
              >
                <button
                  onClick={goToShop}
                  className={`p-2 rounded-full transition-colors relative ${
                    activeLink === "Shop"
                      ? "bg-amber-300 text-emerald-800"
                      : "text-white hover:text-amber-300 hover:bg-emerald-700"
                  }`}
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-emerald-800">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                {isCartHovered && cartItemCount > 0 && (
                  <div className="absolute right-0 mt-2 w-72 p-4 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                    <h4 className="text-sm font-semibold text-gray-900 border-b pb-2 mb-2">
                      Your Cart ({cartItemCount} items)
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Quick view is coming soon...
                    </p>
                    <button
                      onClick={goToShop}
                      className="w-full py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      View Cart
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleNotificationClick}
                className={`p-2 rounded-full transition-colors relative ${
                  activeLink === "Notifications"
                    ? "bg-amber-300 text-emerald-800"
                    : "text-white hover:text-amber-300 hover:bg-emerald-700"
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifications && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-emerald-800" />
                )}
              </button>

              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`p-2 rounded-full transition-colors flex items-center ${
                    isUserDropdownOpen || activeLink === "Mine"
                      ? "bg-amber-300 text-emerald-800"
                      : "text-white hover:text-amber-300 hover:bg-emerald-700"
                  }`}
                  aria-label="User Menu"
                >
                  <User className="w-5 h-5" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {token ? (
                        <>
                          <button
                            onClick={() => handleUserAction("profile")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Profile
                          </button>
                          <button
                            onClick={() => handleUserAction("settings")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </button>
                          <div className="border-t border-gray-100" />
                          <button
                            onClick={() => handleUserAction("logout")}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleNavItemClick("/login", "Mine")}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3 transform rotate-180" />
                          Login / Register
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
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

              <button
                id="mobile-menu-button"
                onClick={toggleMobileMenu}
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
                aria-label="Open Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
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

      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white overflow-y-auto`}
      >
        <div className="p-4 border-b border-emerald-100 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
          <span className="text-xl font-bold text-emerald-800">Menu</span>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={goToShop}
            className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors border-b border-gray-100 relative"
          >
            <div className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-3 text-emerald-600" />
              Shop / Cart
            </div>
            {cartItemCount > 0 && (
              <span className="flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {cartItemCount}
              </span>
            )}
          </button>

          {desktopMenuItems.map((item) => {
            const Icon = item.mobileIcon;

            if (!Icon || item.name === "Home" || item.name === "Prayer Times")
              return null;

            if (item.dropdown) {
              const [isDropdownOpen, setIsDropdownOpen] = mobileDropdownStates[
                item.name
              ] || [false, null];

              return (
                <div key={item.name} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3 text-emerald-600" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isDropdownOpen
                        ? "max-h-96 opacity-100 py-2"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.items ? (
                      item.items.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={() =>
                            handleNavItemClick(subItem.href, subItem.name)
                          }
                          className="w-full text-left flex items-center pl-10 py-2 text-base text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
                        >
                          <subItem.icon className="w-4 h-4 mr-3 text-emerald-500" />
                          {subItem.name}
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-gray-500">
                        <p className="mb-2 pl-6">
                          Full dropdown content coming soon on mobile.
                        </p>
                        <button
                          onClick={() =>
                            handleNavItemClick(item.href, item.name)
                          }
                          className="w-full py-1.5 text-center bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors"
                        >
                          View All {item.name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavItemClick(item.href, item.name)}
                  className="w-full text-left flex items-center py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors border-b border-gray-100"
                >
                  <Icon className="w-5 h-5 mr-3 text-emerald-600" />
                  {item.name}
                </button>
              );
            }
          })}

          <button
            onClick={handleNotificationClick}
            className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors border-b border-gray-100 relative"
          >
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-emerald-600" />
              Notifications
            </div>
            {hasNewNotifications && (
              <span className="flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="md:pt-28 pt-16" />

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-emerald-200">
        <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
          {mobileNavItems.map(({ name, icon: Icon, href }) => (
            <button
              key={name}
              onClick={() => handleNavItemClick(href, name)}
              className={`flex flex-col items-center p-1.5 transition-colors relative ${
                activeLink === name
                  ? "text-emerald-700"
                  : "text-gray-500 hover:text-emerald-600"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {name === "Mine" && hasNewNotifications && token && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white" />
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{name}</span>
              {activeLink === name && (
                <div className="w-6 h-1 bg-emerald-600 rounded-full mt-1 absolute bottom-0 transition-all duration-200" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
