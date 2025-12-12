import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Layers,
  PackageOpen,
  FileText,
  Building,
  Mail,
  Phone,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
} from "lucide-react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { fetchNotifications, markAllNotificationsRead, fetchProfileMe } from "../../Users/Service/apiService";

import DhikrDuaCardDropdown from "./NavtigationDropDownCard/DhikrAndDuaCardDropdown";
import TeachingResourceDropdown from "./NavtigationDropDownCard/TeachingResourcesCardDropdown";
import ArticleDropdown from "./NavtigationDropDownCard/ArticlesCardDropdown";

export default function Navigation({ setShowLogoutModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeLink, setActiveLink] = useState("Home");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const [isDhikrDuaDropdownOpen, setIsDhikrDuaDropdownOpen] = useState(false);
  const [isTeachingDropdownOpen, setIsTeachingDropdownOpen] = useState(false);
  const [isArticleDropdownOpen, setIsArticleDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("appLanguage") || "en"
  );

  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const notificationCount = notifications.filter((n) => !n.read).length;
  const [userProfile, setUserProfile] = useState(null);

  const searchBarRef = useRef(null);
  const dhikrDuaDropdownRef = useRef(null);
  const teachingDropdownRef = useRef(null);
  const articleDropdownRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const languageChangeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setNotifications([]);
        return;
      }
      try {
        const data = await fetchNotifications(token, 20);
        setNotifications(Array.isArray(data) ? data : []);
      } catch {
        // ignore fetch errors to avoid blocking nav
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [token]);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) {
        setUserProfile(null);
        return;
      }
      try {
        const data = await fetchProfileMe(token);
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        // Fallback: try to extract name from token or use email
        setUserProfile(null);
      }
    };
    loadUserProfile();
  }, [token]);

  useEffect(() => {
    const map = {
      "/": "Home",
      "/quran": "Quran",
      "/about": "About",
      "/contact": "About",
      "/donation": "Donation",
      "/app": "About",
      "/prayer-times": "Prayer Times",
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
      "/teaching-tools": "Teaching Resources",
      "/lesson-plans": "Teaching Resources",
      "/audio-resources": "Teaching Resources",
      "/study-guides": "Teaching Resources",
      "/shop": "Shop",
      "/videos": "Videos",
      "/notifications": "Notifications",
    };
    const path = location.pathname;
    let name = map[path] || "";
    if (path.startsWith("/dua-category")) name = "Dhikr & Du'a";
    setActiveLink(name);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.lang = selectedLanguage;
    document.documentElement.dir = ["ar", "ur"].includes(selectedLanguage)
      ? "rtl"
      : "ltr";
  }, [selectedLanguage]);

  const handleLanguageChange = (code) => {
    setSelectedLanguage(code);
    localStorage.setItem("appLanguage", code);
    document.documentElement.lang = code;
    document.documentElement.dir = ["ar", "ur"].includes(code) ? "rtl" : "ltr";
    if (languageChangeTimer.current) {
      clearTimeout(languageChangeTimer.current);
    }
    languageChangeTimer.current = setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("languageChanged", { detail: { code } })
      );
    }, 50);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setCart((c) => c.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const goToShop = () => {
    navigate("/shop");
  };

  const handleNavItemClick = (href, name) => {
    navigate(href);
    setActiveLink(name);
    setIsMobileMenuOpen(false);
    closeAllDropdowns();
  };
  const handleUserAction = (action) => {
    if (action === "profile") navigate("/profile");
    else if (action === "settings") navigate("/settings");
    else if (action === "notifications" && token) {
      navigate("/notifications");
      markAllNotificationsRead(token).catch(() => { });
    } else if (action === "logout") setShowLogoutModal(true);
    setIsUserDropdownOpen(false);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearchBar(false);
    }
  };

  const closeAllDropdowns = () => {
    setIsDhikrDuaDropdownOpen(false);
    setIsTeachingDropdownOpen(false);
    setIsArticleDropdownOpen(false);
    setIsAboutDropdownOpen(false);
  };

  const socialLinks = [
    { id: "fb", icon: Facebook, href: "#", color: "hover:text-blue-600" },
    { id: "tw", icon: Twitter, href: "#", color: "hover:text-sky-500" },
    { id: "ig", icon: Instagram, href: "#", color: "hover:text-pink-600" },
    { id: "yt", icon: Youtube, href: "#", color: "hover:text-red-600" },
  ];

  const aboutMenuItems = [
    { name: "About Us", href: "/about", icon: Building },
    { name: "Contact Us", href: "/contact", icon: Mail },
    { name: "Mobiles App", href: "/app", icon: Phone },
    { name: "Donation", href: "/donation", icon: Heart },
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
      href: "/teaching-tools",
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

  return (
    <>
      <DesktopNavigation
        isScrolled={isScrolled}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        desktopMenuItems={desktopMenuItems}
        activeLink={activeLink}
        handleNavItemClick={handleNavItemClick}
        cart={cart}
        goToShop={goToShop}
        isCartHovered={isCartHovered}
        setIsCartHovered={setIsCartHovered}
        notifications={notifications}
        notificationCount={notificationCount}
        token={token}
        setShowLogoutModal={setShowLogoutModal}
        isUserDropdownOpen={isUserDropdownOpen}
        setIsUserDropdownOpen={setIsUserDropdownOpen}
        handleUserAction={handleUserAction}
        socialLinks={socialLinks}
        searchBarRef={searchBarRef}
        dhikrDuaDropdownRef={dhikrDuaDropdownRef}
        teachingDropdownRef={teachingDropdownRef}
        articleDropdownRef={articleDropdownRef}
        aboutDropdownRef={aboutDropdownRef}
        isDhikrDuaDropdownOpen={isDhikrDuaDropdownOpen}
        setIsDhikrDuaDropdownOpen={setIsDhikrDuaDropdownOpen}
        isTeachingDropdownOpen={isTeachingDropdownOpen}
        setIsTeachingDropdownOpen={setIsTeachingDropdownOpen}
        isArticleDropdownOpen={isArticleDropdownOpen}
        setIsArticleDropdownOpen={setIsArticleDropdownOpen}
        isAboutDropdownOpen={isAboutDropdownOpen}
        setIsAboutDropdownOpen={setIsAboutDropdownOpen}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      <MobileNavigation
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleNavItemClick={handleNavItemClick}
        activeLink={activeLink}
        cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)}
        goToShop={goToShop}
        notificationCount={notificationCount}
        token={token}
        dhikrDuaCategories={[]}
        teachingCategories={[]}
        articleCategories={[]}
        teachingQuickLinks={[]}
        articleQuickLinks={[]}
        aboutMenuItems={aboutMenuItems}
        DhikrDuaCardDropdown={DhikrDuaCardDropdown}
        TeachingResourceDropdown={TeachingResourceDropdown}
        ArticleDropdown={ArticleDropdown}
        onLogout={() => setShowLogoutModal(true)}
        userProfile={userProfile}
      />

      <div className="md:pt-28 pt-16" />
    </>
  );
}
