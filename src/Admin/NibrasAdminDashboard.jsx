import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MainSidebar from "./MainSidebar";
import DashboardContent from "./DashboardContent";
import AnalyticsDashboard from "./AnalyticsDashboard";
import LiveChatMain from "./Chats/LiveChatMain";
import ArticlesPage from "./ArticlesInterface";
import AudioLectureModal from "./AudioLectureInterface";
import DuasAdhkarPage from "./Dua/Duas&AdhkarInterface";
import UsersManagement from "./Users/UserManagement";
import HadithPage from "./HadithManagements";
import SettingsPage from "./SettingsPanel";
import ProfilePage from "./ProfileManagement";
import LogoutPage from "./LogoutInterface";
import CreateCategoryModal from "./CreateCategoryModal";
import VideoLecturesInterface from "./VideoLecturesInterface";

const NibrasAdminDashboard = () => {
  const getInitialPage = () => {
    const savedPage = localStorage.getItem("nibras_admin_active_page");
    return savedPage || "dashboard";
  };

  const [activePage, setActivePageState] = useState(getInitialPage);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("nibras_admin_active_page", activePage);
  }, [activePage]);

  const setActivePage = (page) => {
    setActivePageState(page);
  };

  const isChatPage = activePage === "chat";

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "chat":
        return <LiveChatMain setActivePage={setActivePage} />;
      case "articles":
        return <ArticlesPage />;
      case "lectures":
        return <VideoLecturesInterface />;
      case "audio":
        return <AudioLectureModal/>;
      case "duas":
        return <DuasAdhkarPage />;
      case "categories":
        return <CreateCategoryModal />;
      case "users":
        return <UsersManagement />;
      case "hadith":
        return <HadithPage />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <ProfilePage />;
      case "logout":
        return <LogoutPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {!isChatPage && (
        <MainSidebar
          activePage={activePage}
          setActivePage={setActivePage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          isChatPage
            ? "w-full"
            : sidebarOpen
            ? "ml-0 lg:ml-64"
            : "ml-0 lg:ml-20"
        }`}
      >
        {!isChatPage && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            setActivePage={setActivePage}
          />
        )}

        <main className={isChatPage ? "p-0" : "p-4 sm:p-6"}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default NibrasAdminDashboard;
