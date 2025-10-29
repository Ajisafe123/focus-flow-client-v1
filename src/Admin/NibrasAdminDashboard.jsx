import React, { useState } from "react";
import Navbar from "./Navbar";
import MainSidebar from "./MainSidebar";
import DashboardContent from "./DashboardContent";
import AnalyticsDashboard from "./AnalyticsDashboard";
import LiveChatMain from "./Chats/LiveChatMain";

const NibrasAdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "articles", label: "Articles" },
    { id: "duas", label: "Duas & Adhkar" },
    { id: "users", label: "Users" },
    { id: "comments", label: "Comments" },
    { id: "chat", label: "Live Chat" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {activePage !== "chat" && (
        <>
          <MainSidebar
            activePage={activePage}
            setActivePage={setActivePage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />

          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </>
      )}

      <div
        className={`flex-1 ${
          activePage === "chat"
            ? "w-full"
            : sidebarOpen
            ? "ml-0 lg:ml-64"
            : "ml-0 lg:ml-20"
        }`}
      >
        {activePage !== "chat" && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
        )}

        <main className={activePage !== "chat" ? "p-4 sm:p-6" : ""}>
          {activePage === "dashboard" && <DashboardContent />}
          {activePage === "analytics" && <AnalyticsDashboard />}
          {activePage === "chat" && (
            <LiveChatMain setActivePage={setActivePage} />
          )}
          {activePage !== "dashboard" &&
            activePage !== "analytics" &&
            activePage !== "chat" && (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {menuItems.find((i) => i.id === activePage)?.label}
                </h2>
                <p className="text-gray-600">
                  This section is under development
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default NibrasAdminDashboard;
