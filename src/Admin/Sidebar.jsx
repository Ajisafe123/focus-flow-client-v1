import React from "react";
import {
  Home,
  BookOpen,
  Heart,
  Users,
  MessageSquare,
  MessageCircle,
  Settings,
  BarChart3,
  X,
  Video,
  Headphones,
  BookMarked,
  Calendar,
  LogOut,
  Mail,
} from "lucide-react";

const MainSidebar = ({
  activePage,
  setActivePage,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onLogout,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "articles", icon: BookOpen, label: "Articles" },
    { id: "lectures", icon: Video, label: "Video Lectures" },
    { id: "audio", icon: Headphones, label: "Audio Lectures" },
    { id: "Donations", icon: BookMarked, label: "Donations" },
    { id: "Shops", icon: Calendar, label: "Shops" },
    { id: "duas", icon: Heart, label: "Duas & Adhkar" },
    { id: "users", icon: Users, label: "Users" },
    { id: "hadith", icon: MessageSquare, label: "Hadith" },
    { id: "contacts", icon: Mail, label: "Contact Messages" },
    { id: "chat", icon: MessageCircle, label: "Live Chat" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "logout", icon: LogOut, label: "Logout", action: "logout" },
  ];

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 45 }}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl
        w-64
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${isMobileSidebarOpen ? "z-50" : "z-20"}
        transition-all duration-300 ease-in-out
      `}
      >
        <div className="absolute top-0 right-0 h-full w-1 overflow-hidden">
          <svg
            className="absolute top-0 right-0 h-full w-8"
            viewBox="0 0 32 800"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 0 Q16 100 0 200 T0 400 T0 600 T0 800"
              stroke="url(#gradient1)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500 shadow-lg"></div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          <svg
            className="absolute w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="curves"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 50 Q25 30 50 50 T100 50"
                  stroke="#10b981"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.1"
                />
                <path
                  d="M0 70 Q25 50 50 70 T100 70"
                  stroke="#059669"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#curves)" />
          </svg>
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-32 right-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-4 w-24 h-24 bg-green-400/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                <span className="relative text-white font-bold text-xl">N</span>
              </div>
              <div>
                <span className="text-base font-bold block text-gray-800 tracking-tight">
                  NIBRAS AL-DEEN
                </span>
                <span className="text-xs text-emerald-600 font-medium">
                  Islamic Center
                </span>
              </div>
            </div>
            {isMobileSidebarOpen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action === "logout") {
                    onLogout?.();
                    setIsMobileSidebarOpen(false);
                    return;
                  }
                  setActivePage(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden
                  ${activePage === item.id
                    ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {activePage !== item.id && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                {activePage === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10">
                    <svg
                      width="6"
                      height="40"
                      viewBox="0 0 6 40"
                      className="absolute left-0"
                    >
                      <path
                        d="M0 0 Q6 10 3 20 Q0 30 0 40"
                        fill="white"
                        className="drop-shadow-lg"
                      />
                    </svg>
                  </div>
                )}
                <div
                  className={`relative flex-shrink-0 transition-all duration-300 ${activePage === item.id
                    ? "scale-110"
                    : "group-hover:scale-110 group-hover:text-emerald-600"
                    }`}
                >
                  {activePage === item.id && (
                    <div className="absolute -inset-1.5 bg-white/20 rounded-xl blur-sm"></div>
                  )}
                  <item.icon
                    className="w-5 h-5 relative z-10"
                    strokeWidth={activePage === item.id ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`font-semibold text-sm relative z-10 transition-all duration-300 ${activePage === item.id
                    ? "translate-x-1"
                    : "group-hover:translate-x-1 group-hover:text-emerald-700"
                    }`}
                >
                  {item.label}
                </span>
                {activePage === item.id && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        d="M5 10 Q10 5 15 10 Q10 15 5 10"
                        fill="rgba(255,255,255,0.2)"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
export default MainSidebar;