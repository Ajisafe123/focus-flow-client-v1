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
  Globe,
  Settings,
  LogOut,
  Plus,
  Minus,
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
  onLogout,
  userProfile,
}) => {
  const [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen] = useState(false);
  const [isMobileTeachingOpen, setIsMobileTeachingOpen] = useState(false);
  const [isMobileArticleOpen, setIsMobileArticleOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(true);

  const toggleMobileDropdown = (name) => {
    const states = {
      "Dhikr & Du'a": [isMobileDhikrDuaOpen, setIsMobileDhikrDuaOpen],
      "Teaching Resources": [isMobileTeachingOpen, setIsMobileTeachingOpen],
      Articles: [isMobileArticleOpen, setIsMobileArticleOpen],
      About: [isMobileAboutOpen, setIsMobileAboutOpen],
      Languages: [isLanguageOpen, setIsLanguageOpen],
      Profile: [isProfileOpen, setIsProfileOpen],
    };

    const [state, setState] = states[name];
    setState(!state);
  };

  const languages = [
    { code: "en", name: "English", flag: "GB" },
    { code: "ar", name: "العربية", flag: "SA" },
    { code: "ur", name: "اردو", flag: "PK" },
    { code: "bn", name: "বাংলা", flag: "BD" },
    { code: "id", name: "Bahasa Indonesia", flag: "ID" },
    { code: "ms", name: "Bahasa Melayu", flag: "MY" },
    { code: "tr", name: "Türkçe", flag: "TR" },
    { code: "fr", name: "Français", flag: "FR" },
    { code: "ha", name: "Hausa", flag: "NG" },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-800 to-teal-800 shadow-lg border-b border-emerald-700/50 backdrop-blur-md">
        <div className="flex flex-col">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => handleNavItemClick("/", "Home")}
              className="text-white hover:text-amber-300 transition-colors group p-1 -ml-1"
            >
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                  Nibras Al-deen
                </span>
                <span className="text-[10px] font-medium text-emerald-300 uppercase tracking-widest -mt-0.5">
                  Light of Guidance
                </span>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleNavItemClick("/notifications", "Notifications")
                }
                className="p-2.5 rounded-xl hover:bg-white/10 transition-all relative group"
              >
                <Bell className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                {notificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-emerald-800 shadow-sm animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>

              <button
                id="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen((p) => !p)}
                className={`p-2.5 rounded-xl transition-all ${isMobileMenuOpen ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } bg-white shadow-2xl flex flex-col`}
      >
        <div className="p-6 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Menu</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-200" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:bg-black/30 text-sm text-white placeholder-emerald-200/70 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {token ? (
            <div className="mb-4">
              <button
                onClick={() => toggleMobileDropdown("Profile")}
                className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${isProfileOpen ? 'bg-emerald-50 shadow-sm ring-1 ring-emerald-100' : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-800 text-sm">
                      {userProfile?.name || userProfile?.username || userProfile?.full_name || userProfile?.email?.split('@')[0] || "Account"}
                    </span>
                    {userProfile?.email && (
                      <span className="block text-xs text-gray-500 mt-0.5">{userProfile.email}</span>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 text-emerald-500 ${isProfileOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${isProfileOpen
                  ? "max-h-60 opacity-100 mt-2 space-y-1"
                  : "max-h-0 opacity-0"
                  }`}
              >
                <button onClick={() => { handleNavItemClick("/profile", "Profile"); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors pl-4">
                  <User className="w-4 h-4 text-emerald-500" />
                  Profile
                </button>
                <button onClick={() => { handleNavItemClick("/settings", "Settings"); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-3 p-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors pl-4">
                  <Settings className="w-4 h-4 text-emerald-500" />
                  Settings
                </button>
                <button onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }} className="flex w-full items-center gap-3 p-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors pl-4">
                  <LogOut className="w-4 h-4 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 text-center">
              <h3 className="font-bold text-gray-800 mb-1">Welcome!</h3>
              <p className="text-xs text-gray-500 mb-3">Sign in to access all features</p>
              <button
                onClick={() => handleNavItemClick("/login", "Login")}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform active:scale-95 transition-all"
              >
                Login / Register
              </button>
            </div>
          )}

          <div className="space-y-1">
            <span className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Navigation</span>

            {[
              { name: "Dhikr & Du'a", icon: Layers, href: "/dua", state: isMobileDhikrDuaOpen, dropdown: <DhikrDuaCardDropdown setIsDhikrDuaDropdownOpen={setIsMobileDhikrDuaOpen} quickLinksOnly onQuickLinkClick={(href) => { handleNavItemClick(href, "Dhikr & Du'a"); setIsMobileMenuOpen(false); }} /> },
              { name: "Teaching Resources", icon: PackageOpen, href: "/teaching-tools", state: isMobileTeachingOpen, dropdown: <TeachingResourceDropdown setIsTeachingDropdownOpen={setIsMobileTeachingOpen} quickLinksOnly onQuickLinkClick={(href) => { handleNavItemClick(href, "Teaching Resources"); setIsMobileMenuOpen(false); }} /> },
              { name: "Articles", icon: FileText, href: "/articles", state: isMobileArticleOpen, dropdown: <ArticleDropdown setIsArticleDropdownOpen={setIsMobileArticleOpen} quickLinksOnly onQuickLinkClick={(href) => { handleNavItemClick(href, "Articles"); setIsMobileMenuOpen(false); }} /> },
              { name: "About", icon: Building, state: isMobileAboutOpen, subItems: aboutMenuItems },
              { name: "Languages", icon: Globe, state: isLanguageOpen, subItems: languages, isLang: true }
            ].map((item) => (
              <div key={item.name} className="border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { handleNavItemClick(item.href, item.name); setIsMobileMenuOpen(false); }}
                    className={`flex-1 flex items-center gap-3 p-3 rounded-xl transition-all text-gray-700 hover:bg-gray-50`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-gray-100 text-gray-500`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{item.name}</span>
                  </button>
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className={`p-3 rounded-xl transition-colors ${item.state ? 'text-emerald-600 bg-emerald-100' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={item.state ? `Close ${item.name}` : `Open ${item.name}`}
                  >
                    {item.state ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                <div className={`transition-all duration-300 overflow-hidden ${item.state ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-2 pl-4 border-l-2 border-emerald-200 ml-4 mt-1 space-y-1 bg-emerald-50/30">
                    {item.dropdown || (item.subItems && item.subItems.map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (item.isLang) { console.log(sub.name); }
                          else { handleNavItemClick(sub.href, sub.name); }
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 p-2.5 rounded-lg text-sm text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                      >
                        {item.isLang && <span className="text-lg">{sub.flag}</span>}
                        {sub.icon && <sub.icon className="w-4 h-4 text-emerald-400" />}
                        <span className="font-medium">{sub.name}</span>
                      </button>
                    )))}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => handleNavItemClick("/donation", "Donation")}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all mt-2"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Donation</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] border-t border-gray-100 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
          {[
            { name: "Home", icon: Home, href: "/" },
            { name: "Quran", icon: BookOpen, href: "/quran" },
            { name: "Prayer", icon: Clock, href: "/prayer-times" },
            { name: "Ramadan", icon: Calendar, href: "/ramadan" },
            { name: "Shop", icon: ShoppingCart, href: "/shop", onClick: goToShop },
          ].map(({ name, icon: Icon, href, onClick }) => (
            <button
              key={name}
              onClick={() =>
                onClick ? onClick() : handleNavItemClick(href, name)
              }
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative ${activeLink === name
                ? "text-emerald-600"
                : "text-gray-400 hover:text-emerald-500"
                }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeLink === name ? 'bg-emerald-50 transform -translate-y-1 shadow-sm' : ''}`}>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${activeLink === name ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {name === "Shop" && cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                  )}
                </div>
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-all duration-300 ${activeLink === name ? 'transform -translate-y-1' : ''}`}>{name}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
