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
  Moon,
} from "lucide-react";

const MainSidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "articles", icon: BookOpen, label: "Articles" },
    { id: "duas", icon: Heart, label: "Duas & Adhkar" },
    { id: "users", icon: Users, label: "Users" },
    { id: "comments", icon: MessageSquare, label: "Comments" },
    { id: "chat", icon: MessageCircle, label: "Live Chat" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const handleNavItemClick = (path) => {
    console.log("Navigating to:", path);
  };

  if (activePage === "chat") {
    return null;
  }

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  transition-all duration-300 shadow-2xl border-r border-emerald-700/30
        ${
          isMobileSidebarOpen
            ? "translate-x-0 z-[70]"
            : "-translate-x-full z-[70]"
        }
        lg:translate-x-0 lg:z-20
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => handleNavItemClick("/")}
              className={`flex items-center transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-900 rounded-xl p-1 ${
                sidebarOpen ? "space-x-3" : "justify-center w-full"
              }`}
            >
              {/* <div className="bg-gradient-to-br from-amber-400/20 to-amber-500/10 p-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 shadow-lg relative flex items-center justify-center border border-amber-400/20 group-hover:shadow-amber-500/50 group-hover:shadow-xl">
                <Moon className="w-7 h-7 text-amber-300 transition-all duration-300 drop-shadow-lg" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="text-xl font-extrabold block text-white tracking-wider drop-shadow-lg transition-colors">
                    NIBRAS AL-DEEN
                  </span>
                  <span className="text-xs text-emerald-300 font-medium transition-colors">
                    Islamic Center
                  </span>
                </div>
              )} */}
            </button>
            {isMobileSidebarOpen && (
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 hover:scale-110"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`relative w-full flex items-center transition-all duration-300 group
                  ${
                    sidebarOpen
                      ? "gap-3 px-4 py-3.5 rounded-xl"
                      : "justify-center py-4 rounded-xl"
                  }
                  ${
                    activePage === item.id
                      ? sidebarOpen
                        ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 text-amber-100 shadow-lg border border-amber-500/40 scale-105"
                        : "bg-amber-500/30 text-amber-200 shadow-xl scale-110 border-2 border-amber-400/50"
                      : sidebarOpen
                      ? "text-emerald-100 border border-transparent hover:scale-105 hover:border-emerald-600/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-inset"
                      : "text-emerald-200 border border-transparent hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80"
                  }`}
              >
                {activePage === item.id && sidebarOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-500 rounded-r-full shadow-lg shadow-amber-500/50"></span>
                )}

                <div
                  className={`flex-shrink-0 transition-all duration-300 ${
                    activePage === item.id
                      ? "text-amber-300"
                      : "text-emerald-200 group-hover:text-amber-200"
                  }`}
                >
                  <item.icon
                    className={`${sidebarOpen ? "w-5 h-5" : "w-6 h-6"}`}
                  />
                </div>

                {sidebarOpen && (
                  <span
                    className={`font-medium transition-all duration-300 ${
                      activePage === item.id
                        ? "text-amber-50"
                        : "group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                )}

                {!sidebarOpen && (
                  <div className="absolute left-full ml-6 px-4 py-2.5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white text-sm font-semibold rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 -translate-x-2 transition-all duration-300 whitespace-nowrap z-50 border border-amber-400/20">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-emerald-900"></div>
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
