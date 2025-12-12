import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import SidebarNew from "./SidebarNew";
import DashboardContent from "./DashboardContent";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AdminChatInterface from "./Chats/AdminChatInterface";
import ArticlesPage from "./Articles/Articles";
import AudioLectureModal from "./AudioLectures/AudioLectures";
import DuasAdhkarPage from "./Duas/DuasManagements";
import UsersManagement from "./Users/UserManagement";
import HadithPage from "./Hadiths/HadithManagements";
import SettingsPage from "./Settings/Settings";
import ProfilePage from "./Profile/Profile";
import LogoutModal from "../Components/Authentications/LogoutModal";
import CreateCategoryModal from "./CreateCategoryModal";
import VideoLecturesInterface from "./VideoLectures/VideoLectures";
import NotificationsPage from "./NotificationsPage";
import AdminMessagesPage from "./Contact/AdminMessagesPage";
import ShopManagement from "./Shops/ShopManagement";
import DonationManagement from "./Donations/DonationManagement";
import TeachingResources from "./TeachingResources/TeachingResources";

const NibrasAdminDashboard = () => {
  const getInitialPage = () => {
    const savedPage = localStorage.getItem("nibras_admin_active_page");
    return savedPage || "dashboard";
  };

  const [activePage, setActivePageState] = useState(getInitialPage());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("nibras_admin_active_page", activePage);
  }, [activePage]);

  const setActivePage = (page) => {
    setActivePageState(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent setActivePage={setActivePage} />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "chat":
        return <AdminChatInterface />;
      case "articles":
        return <ArticlesPage />;
      case "lectures":
        return <VideoLecturesInterface />;
      case "audio":
        return <AudioLectureModal />;
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
      case "contacts":
        return <AdminMessagesPage />;
      case "notifications":
        return <NotificationsPage />;
      case "Shops":
        return <ShopManagement />;
      case "Donations":
        return <DonationManagement />;
      case "resources":
        return <TeachingResources />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarNew
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onLogout={() => setShowLogoutModal(true)}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-0 lg:ml-64" : "ml-0 lg:ml-20"
          }`}
      >
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          setActivePage={setActivePage}
          onLogout={() => setShowLogoutModal(true)}
        />

        <main className="p-4 sm:p-6">{renderPage()}</main>
      </div>
      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
        />
      )}
    </div>
  );
};

export default NibrasAdminDashboard;
