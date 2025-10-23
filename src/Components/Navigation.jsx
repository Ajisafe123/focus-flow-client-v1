import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Clock,
  Calendar,
  Bell,
  User,
  LogIn,
  LogOut,
  Settings,
  UserCircle,
  Phone,
  Info,
  ChevronDown,
  BookOpen,
  MessageCircle,
  Calculator,
  Compass,
  Star,
} from "lucide-react";

export default function Navigation({ isLoggedIn, setShowLogoutModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpenDesktop, setIsUserMenuOpenDesktop] = useState(false);
  const [isUserMenuOpenMobile, setIsUserMenuOpenMobile] = useState(false);
  const [isIslamicDropdownOpenDesktop, setIsIslamicDropdownOpenDesktop] =
    useState(false);
  const [isIslamicDropdownOpenMobile, setIsIslamicDropdownOpenMobile] =
    useState(false);
  const userMenuRefDesktop = useRef(null);
  const userMenuRefMobile = useRef(null);
  const islamicDropdownRefDesktop = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpenDesktop(false);
    setIsUserMenuOpenMobile(false);
    setIsIslamicDropdownOpenDesktop(false);
    setIsIslamicDropdownOpenMobile(false);
  };

  const handleNavItemClick = (href) => {
    closeAllMenus();
    navigate(href);
  };

  const handleDropdownAction = (action) => {
    closeAllMenus();
    if (action === "profile") navigate("/profile");
    else if (action === "settings") navigate("/settings");
    else if (action === "logout") setShowLogoutModal(true);
    else if (action === "login") navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRefDesktop.current &&
        !userMenuRefDesktop.current.contains(event.target)
      ) {
        setIsUserMenuOpenDesktop(false);
      }
      if (
        userMenuRefMobile.current &&
        !userMenuRefMobile.current.contains(event.target)
      ) {
        setIsUserMenuOpenMobile(false);
      }
      if (
        islamicDropdownRefDesktop.current &&
        !islamicDropdownRefDesktop.current.contains(event.target)
      ) {
        setIsIslamicDropdownOpenDesktop(false);
      }
      if (isMenuOpen && !menuButtonRef.current.contains(event.target)) {
        const mobileMenuArea = document.getElementById("mobile-menu-items");
        if (mobileMenuArea && !mobileMenuArea.contains(event.target)) {
          setIsMenuOpen(false);
          setIsIslamicDropdownOpenMobile(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const islamicResources = [
    { name: "Dua", href: "/dua", icon: BookOpen },
    { name: "Hadith", href: "/hadith", icon: MessageCircle },
    { name: "Islamic Calendar", href: "/islamic-calendar", icon: Calendar },
    { name: "99 Names of Allah", href: "/99-names", icon: Star },
    { name: "Zakat Calculator", href: "/zakat-calculator", icon: Calculator },
    { name: "Qibla Finder", href: "/qibla-finder", icon: Compass },
  ];

  const menuItems = [
    { name: "Home", href: "/", icon: Moon },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
    { name: "Prayer Times", href: "/prayer-times", icon: Clock },
  ];

  const Dropdown = ({ position }) => (
    <div
      className={`absolute z-50 ${
        position === "up" ? "bottom-full right-0 mb-2" : "top-full right-0 mt-2"
      } bg-white w-52 rounded-2xl overflow-hidden transform transition-all duration-200 shadow-xl`}
    >
      {isLoggedIn ? (
        <>
          <button
            onClick={() => handleDropdownAction("profile")}
            className="flex items-center w-full px-5 py-3.5 text-emerald-800 font-semibold hover:bg-emerald-50 transition-all duration-200"
          >
            <UserCircle className="w-5 h-5 mr-3 text-emerald-600" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => handleDropdownAction("settings")}
            className="flex items-center w-full px-5 py-3.5 text-emerald-800 font-semibold hover:bg-emerald-50 transition-all duration-200"
          >
            <Settings className="w-5 h-5 mr-3 text-emerald-600" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => handleDropdownAction("logout")}
            className="flex items-center w-full px-5 py-3.5 text-red-600 font-semibold hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <button
          onClick={() => handleDropdownAction("login")}
          className="flex items-center w-full px-5 py-3.5 text-emerald-800 font-semibold hover:bg-emerald-50 transition-all duration-200"
        >
          <LogIn className="w-5 h-5 mr-3 text-emerald-600" />
          <span>Login</span>
        </button>
      )}
    </div>
  );

  const IslamicResourcesDropdown = () => (
    <div className="absolute z-50 top-full left-0 mt-2 bg-white w-64 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-200">
      <div className="bg-gradient-to-right from-emerald-600 to-teal-600 px-5 py-4">
        <h3 className="text-white font-bold text-sm tracking-wide">
          ISLAMIC RESOURCES
        </h3>
      </div>
      <div className="py-2">
        {islamicResources.map(({ name, href, icon: Icon }, idx) => (
          <button
            key={idx}
            onClick={() => handleNavItemClick(href)}
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
  );

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-800 shadow-2xl">
      <div className="absolute inset-0 bg-black opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <button
            onClick={() => handleNavItemClick("/")}
            className="flex items-center space-x-3 transition-all duration-300 hover:scale-105 group"
          >
            <div className="bg-white/15 p-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white/25 shadow-lg">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-200 group-hover:text-amber-100 transition-colors" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold block text-white tracking-wider drop-shadow-lg">
                NIBRAS AL-DEEN
              </span>
              <span className="text-xs sm:text-sm text-emerald-200 hidden sm:block font-medium">
                Islamic Center & Community
              </span>
            </div>
          </button>
          <div className="hidden md:flex space-x-6 items-center">
            {menuItems.map(({ name, href, icon: Icon }, idx) => (
              <button
                key={idx}
                onClick={() => handleNavItemClick(href)}
                className="flex items-center space-x-2 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-white/15 backdrop-blur-sm group"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{name}</span>
              </button>
            ))}
            <div className="relative" ref={islamicDropdownRefDesktop}>
              <button
                onClick={() => setIsIslamicDropdownOpenDesktop((prev) => !prev)}
                className={`flex items-center space-x-2 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 rounded-xl backdrop-blur-sm ${
                  isIslamicDropdownOpenDesktop
                    ? "bg-white/20"
                    : "hover:bg-white/15"
                } group`}
              >
                <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Islamic Resources</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isIslamicDropdownOpenDesktop ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isIslamicDropdownOpenDesktop && <IslamicResourcesDropdown />}
            </div>
            <button className="relative p-2.5 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm group">
              <Bell className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center font-bold rounded-full shadow-lg animate-pulse">
                3
              </span>
            </button>
            <div className="relative" ref={userMenuRefDesktop}>
              <button
                onClick={() => setIsUserMenuOpenDesktop((prev) => !prev)}
                className={`p-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                  isUserMenuOpenDesktop ? "bg-white/20" : "hover:bg-white/15"
                }`}
              >
                <User className="w-6 h-6 text-white" />
              </button>
              {isUserMenuOpenDesktop && <Dropdown position="down" />}
            </div>
          </div>
          <button
            onClick={toggleMenu}
            ref={menuButtonRef}
            className="md:hidden p-2.5 rounded-xl transition-all duration-300 hover:bg-white/15 backdrop-blur-sm"
          >
            {isMenuOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Menu className="w-7 h-7 text-white" />
            )}
          </button>
        </div>
      </div>
      <div
        id="mobile-menu-items"
        className={`md:hidden overflow-hidden bg-gradient-to-b from-emerald-700 to-emerald-800 transition-all duration-300 ${
          isMenuOpen ? "max-h-screen py-4 opacity-100" : "max-h-0 opacity-0"
        } shadow-inner`}
      >
        <div className="px-4">
          {menuItems.map(({ name, href, icon: Icon }, idx) => (
            <button
              key={idx}
              onClick={() => handleNavItemClick(href)}
              className="flex items-center space-x-4 py-3 px-4 w-full text-left text-white text-base font-semibold transition-all duration-300 hover:bg-white/15 rounded-xl mb-2 backdrop-blur-sm"
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </button>
          ))}
          <div className="mb-2">
            <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
              <button
                onClick={() => setIsIslamicDropdownOpenMobile((prev) => !prev)}
                className="flex items-center justify-between w-full text-white font-bold text-sm mb-2"
              >
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  ISLAMIC RESOURCES
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isIslamicDropdownOpenMobile ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isIslamicDropdownOpenMobile && (
                <div className="mt-2">
                  {islamicResources.map(({ name, href, icon: Icon }, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavItemClick(href)}
                      className="flex items-center space-x-3 py-2.5 px-3 w-full text-left text-white text-sm font-medium transition-all duration-200 hover:bg-white/15 rounded-xl mb-1 last:mb-0"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center px-2 py-4 mt-2">
            <button className="relative p-2.5 rounded-xl hover:bg-white/15 transition-all duration-300 backdrop-blur-sm">
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center font-bold rounded-full shadow-lg">
                3
              </span>
            </button>

            <div className="relative" ref={userMenuRefMobile}>
              <button
                onClick={() => setIsUserMenuOpenMobile((prev) => !prev)}
                className={`p-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm ${
                  isUserMenuOpenMobile ? "bg-white/20" : "hover:bg-white/15"
                }`}
              >
                <User className="w-6 h-6 text-white" />
              </button>
              {isUserMenuOpenMobile && <Dropdown position="up" />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
