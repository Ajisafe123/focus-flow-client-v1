import React, { useState } from "react";
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
  ShoppingCart,
  LogOut,
  Mail,
  Lightbulb,
  ChevronDown,
  Menu,
} from "lucide-react";

const SidebarNew = ({
  activePage,
  setActivePage,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onLogout,
}) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const menuSections = [
    {
      title: "Main",
      items: [
        { id: "dashboard", icon: Home, label: "Dashboard" },
        { id: "analytics", icon: BarChart3, label: "Analytics" },
      ],
    },
    {
      title: "Content Management",
      items: [
        { id: "articles", icon: BookOpen, label: "Articles" },
        { id: "lectures", icon: Video, label: "Video Lectures" },
        { id: "audio", icon: Headphones, label: "Audio Lectures" },
        { id: "duas", icon: Heart, label: "Duas & Adhkar" },
        { id: "hadith", icon: MessageSquare, label: "Hadith" },
        { id: "resources", icon: Lightbulb, label: "Teaching Resources" },
      ],
    },
    {
      title: "Business",
      items: [
        { id: "Shops", icon: ShoppingCart, label: "Shops" },
        { id: "Donations", icon: BookMarked, label: "Donations" },
      ],
    },
    {
      title: "Community",
      items: [
        { id: "users", icon: Users, label: "Users" },
        { id: "contacts", icon: Mail, label: "Contact Messages" },
        { id: "chat", icon: MessageCircle, label: "Live Chat" },
      ],
    },
    {
      title: "Settings",
      items: [
        { id: "settings", icon: Settings, label: "Settings" },
      ],
    },
  ];

  const handleLogout = () => {
    onLogout?.();
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white text-gray-800 w-72 transform transition-transform duration-300 ease-in-out z-50 lg:z-20 shadow-2xl
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto flex flex-col border-r-4 border-emerald-500
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-green-600 p-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-emerald-600 font-bold text-lg">N</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">NIBRAS</p>
              <p className="text-xs text-emerald-50">Admin Panel</p>
            </div>
          </div>
          {isMobileSidebarOpen && (
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider px-4 mb-3">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                        ${isActive
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                          : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`} />
                      <span className="font-semibold text-sm flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t-2 border-emerald-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarNew;
