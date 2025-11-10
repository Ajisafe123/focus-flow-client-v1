import React, { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
} from "lucide-react";

const Navbar = ({
  showProfileMenu,
  setShowProfileMenu,
  setIsMobileSidebarOpen,
  setActivePage,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-8 sm:py-4">
        <div
          className={`flex items-center gap-3 sm:gap-4 flex-1 transition-all duration-300 ${
            isSearchOpen ? "w-full" : ""
          }`}
        >
          <button
            onClick={handleMenuClick}
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-200 hover:bg-gray-100 active:scale-95 ${
              isSearchOpen ? "hidden" : "block"
            }`}
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <div
            className={`flex-1 max-w-full lg:max-w-2xl transition-all duration-300 ${
              isSearchOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="relative group">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 group-focus-within:text-emerald-500" />
              <input
                type="text"
                placeholder="Search articles, duas, hadith..."
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm sm:text-base shadow-sm"
              />
              {isSearchOpen && (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all duration-200 lg:hidden hover:bg-gray-100 active:scale-95"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
            isSearchOpen ? "hidden" : "flex"
          }`}
        >
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2.5 rounded-xl transition-all duration-200 lg:hidden hover:bg-gray-100 active:scale-95"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="relative p-2.5 rounded-xl transition-all duration-200 hidden lg:flex hover:bg-gray-100 active:scale-95 group">
            <Bell className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors duration-200" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-2 py-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-200 hover:bg-gray-100 active:scale-95"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 hidden sm:block transition-transform duration-200 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-green-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        admin@example.com
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setActivePage("notifications");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all duration-200 group lg:hidden"
                  >
                    <div className="relative w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                      <Bell className="w-4 h-4 text-emerald-600" />
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">
                          {notificationCount}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-sm">Notifications</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePage("profile");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                      <User className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-sm">Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActivePage("settings");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                      <Settings className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium text-sm">Settings</span>
                  </button>

                  <div className="my-2 border-t border-gray-100"></div>

                  <button
                    onClick={() => {
                      setActivePage("logout");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
