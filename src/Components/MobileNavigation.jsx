import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Bell,
  Home,
  BookOpen,
  Clock,
  Calendar,
  User,
  Layers,
  PackageOpen,
  FileText,
  Building,
  Heart,
  ChevronDown,
} from "lucide-react";

const MobileNavigation = ({
  showSearchBar,
  setShowSearchBar,
  searchQuery,
  setSearchQuery,
  handleSearch,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleNavItemClick,
  activeLink,
  cartItemCount,
  goToShop,
  notificationCount,
  token,
  aboutMenuItems,
  DhikrDuaCardDropdown,
  TeachingResourceDropdown,
  ArticleDropdown,
}) => {
  const [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen] = useState(false);
  const [isMobileTeachingOpen, setIsMobileTeachingOpen] = useState(false);
  const [isMobileArticleOpen, setIsMobileArticleOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);

  const toggleMobileDropdown = (name) => {
    const states = {
      "Dhikr & Du'a": [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen],
      "Teaching Resources": [isMobileTeachingOpen, setIsMobileTeachingOpen],
      Articles: [isMobileArticleOpen, setIsMobileArticleOpen],
      About: [isMobileAboutOpen, setIsMobileAboutOpen],
    };

    Object.keys(states).forEach((key) => {
      if (key !== name) states[key][1](false);
    });
    const [state, setState] = states[name];
    setState(!state);
  };

  return (
    <>
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
                onClick={() => setIsMobileMenuOpen((p) => !p)}
                className="p-2 rounded-full hover:bg-white/15 transition-colors"
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
        className={`fixed top-0 left-0 h-full w-full z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white overflow-y-auto`}
      >
        <div className="p-4 border-b border-emerald-100 flex justify-between items-center sticky top-0 bg-white z-10 shadow-sm">
          <span className="text-xl font-bold text-emerald-800">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
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
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("Dhikr & Du'a")}
              className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center">
                <Layers className="w-5 h-5 mr-3 text-emerald-600" />
                Dhikr & Du'a
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileDhikrDuaOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileDhikrDuaOpen
                  ? "max-h-[600px] opacity-100 py-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <DhikrDuaCardDropdown
                setIsDhikrDuaDropdownOpen={setIsMobileDhikrDuaOpen}
                quickLinksOnly
                onQuickLinkClick={(href) => {
                  handleNavItemClick(href, "Dhikr & Du'a");
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("Teaching Resources")}
              className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center">
                <PackageOpen className="w-5 h-5 mr-3 text-emerald-600" />
                Teaching Resources
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileTeachingOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileTeachingOpen
                  ? "max-h-[600px] opacity-100 py-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <TeachingResourceDropdown
                setIsTeachingDropdownOpen={setIsMobileTeachingOpen}
                quickLinksOnly
                onQuickLinkClick={(href) => {
                  handleNavItemClick(href, "Teaching Resources");
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("Articles")}
              className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-3 text-emerald-600" />
                Articles
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileArticleOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileArticleOpen
                  ? "max-h-[600px] opacity-100 py-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ArticleDropdown
                setIsArticleDropdownOpen={setIsMobileArticleOpen}
                quickLinksOnly
                onQuickLinkClick={(href) => {
                  handleNavItemClick(href, "Articles");
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("About")}
              className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-3 text-emerald-600" />
                About
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMobileAboutOpen ? "rotate-180 text-emerald-600" : ""
                }`}
              />
            </button>

            <div
              className={`transition-all duration-300 overflow-hidden ${
                isMobileAboutOpen
                  ? "max-h-96 opacity-100 py-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              {aboutMenuItems.map((subItem) => (
                <button
                  key={subItem.name}
                  onClick={() => {
                    handleNavItemClick(subItem.href, subItem.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center pl-10 py-2 text-base text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
                >
                  <subItem.icon className="w-4 h-4 mr-3 text-emerald-500" />
                  {subItem.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleNavItemClick("/donation", "Donation")}
            className="w-full text-left flex items-center py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors border-b border-gray-100"
          >
            <Heart className="w-5 h-5 mr-3 text-emerald-600" />
            Donation
          </button>
          
          <button
            onClick={() =>
              handleNavItemClick("/notifications", "Notifications")
            }
            className="w-full text-left flex items-center justify-between py-3 text-lg font-medium text-gray-700 hover:text-emerald-700 transition-colors border-b border-gray-100 relative"
          >
            <div className="flex items-center">
              <Bell className="w-5 h-5 mr-3 text-emerald-600" />
              Notifications
            </div>
            {notificationCount > 0 && (
              <span className="flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-emerald-200">
        <div className="flex justify-around items-center h-16 max-w-xl mx-auto">
          {[
            { name: "Home", icon: Home, href: "/" },
            { name: "Quran", icon: BookOpen, href: "/quran" },
            { name: "Prayer", icon: Clock, href: "/prayer-times" },
            { name: "Ramadan", icon: Calendar, href: "/ramadan" },
            { name: "Mine", icon: User, href: token ? "/profile" : "/login" },
          ].map(({ name, icon: Icon, href }) => (
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
                {name === "Mine" && notificationCount > 0 && token && (
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
};

export default MobileNavigation;
