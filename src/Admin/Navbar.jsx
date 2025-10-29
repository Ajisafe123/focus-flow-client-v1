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
  sidebarOpen,
  setSidebarOpen,
  showProfileMenu,
  setShowProfileMenu,
  setIsMobileSidebarOpen,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(true);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <header className="bg-emerald-900 shadow-2xl sticky top-0 z-40 backdrop-blur-md border-b border-white/20 font-sans">
      <div className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        <div
          className={`flex items-center gap-2 sm:gap-4 flex-1 transition-all duration-300 ${
            isSearchOpen ? "w-full" : ""
          }`}
        >
          <button
            onClick={handleMenuClick}
            className={`p-2 sm:p-2.5 rounded-xl transition-all duration-300 active:scale-95 hover:scale-110 ${
              isSearchOpen ? "hidden" : "block"
            }`}
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          <div
            className={`flex-1 max-w-full lg:max-w-2xl transition-all duration-300 ${
              isSearchOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="relative group">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-white" />
              <input
                type="text"
                placeholder="Search articles, duas..."
                className="w-full pl-9 sm:pl-12 pr-10 sm:pr-4 py-2 sm:py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white placeholder-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-300/50 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base font-medium shadow-inner"
              />
              {isSearchOpen && (
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 lg:hidden hover:scale-110"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 sm:gap-4 transition-all duration-300 ${
            isSearchOpen ? "hidden" : "flex"
          }`}
        >
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 sm:p-2.5 rounded-xl transition-all duration-300 active:scale-95 lg:hidden hover:scale-110"
          >
            <Search className="w-5 h-5 text-white" />
          </button>

          <button className="relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 active:scale-95 group hidden lg:block hover:scale-110">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-teal-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full animate-pulse ring-2 ring-white/70"></span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 sm:p-2.5 bg-white/10 rounded-full transition-all duration-300 active:scale-95 group ring-2 ring-white/30 hover:ring-white/50 hover:bg-white/20"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300">
                <User className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
              </div>

              <ChevronDown
                className={`w-4 h-4 text-white hidden sm:block transition-transform duration-300 ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-52 sm:w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Admin User
                      </p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 text-gray-700 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <Bell className="w-4 h-4 text-purple-700" />
                      </div>
                      <span className="font-medium text-sm">Notifications</span>
                    </div>
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-gray-700 transition-all duration-200 group">
                    <div className="p-1.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <User className="w-4 h-4 text-emerald-700" />
                    </div>
                    <span className="font-medium text-sm">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-gray-700 transition-all duration-200 group">
                    <div className="p-1.5 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                      <Settings className="w-4 h-4 text-teal-700" />
                    </div>
                    <span className="font-medium text-sm">Settings</span>
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-all duration-200 group">
                    <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
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
