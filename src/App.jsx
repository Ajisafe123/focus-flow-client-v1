import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./Components/LandingPage/Hero";
import LiveDua from "./Components/LandingPage/LiveDua";
import LiveChat from "./Users/Chats/Livechat";
import DailyHadith from "./Components/LandingPage/DailyHadith";
import About from "./Components/LandingPage/About";
import Contact from "./Components/LandingPage/Contact";
import DonationPage from "./Users/Donations/DonationPage";
import Footer from "./Components/LandingPage/Footer";
import LoginPage from "./Components/Authentications/LoginPage";
import RegisterPage from "./Components/Authentications/RegisterPage";
import ForgotPassword from "./Components/Authentications/ForgotPassword";
import ResetPassword from "./Components/Authentications/ResetPassword";
import VerifyEmail from "./Components/Authentications/VerifyEmail";
import Navigation from "./Components/Navigations/Navigation";
import LogoutModal from "./Components/Authentications/LogoutModal";
import PrayerTimesTable from "./Users/PrayerTimesTable";
import Hadith from "./Users/Hadiths/HadithList";
import IslamicCalendar from "./Users/IslamicCalendar";
import NamesOfAllah from "./Users/NamesOfAllah";
import QiblaFinder from "./Users/QiblaFinder";
import SettingsPage from "./Users/Settings";
import ProfilePage from "./Users/Profile/Profile";
import AdminDashboard from "./Admin/Dashboard";
import apiService from "./Components/Service/apiService";
import ArticlesInterface from "./Admin/Articles/Articles";
import QuranPage from "./Users/Quran/Quran";
import DuaCategoryPage from "./Users/Duas/DuaList";
import ArticlesPage from "./Users/Articles/ArticlesPage";
import VideoPlayer from "./Users/VideoLectures/VideoPlayer";
import ShopPage from "./Users/Shops/ShopPage";
import TeachingToolsPage from "./Users/TeachingTools/TeachingToolsPage";
import LessonPlansPage from "./Users/TeachingTools/LessonPlansPage";
import AudioResourcesPage from "./Users/AudioLectures/AudioResourcesPage";
import StudyGuidesPage from "./Users/TeachingTools/StudyGuidesPage";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import AppShowcase from "./Components/AppShowCase";
import NotificationCenter from "./Users/Notification";
import RamadanPage from "./Users/Ramadan";
import AdminMessagesPage from "./Admin/Contact/AdminMessagesPage";
import NotFound from "./Components/Common/NotFound";
import NetworkStatus from "./Components/Common/NetworkStatus";
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 },
};

const pageTransition = { type: "tween", ease: "easeInOut", duration: 0.3 };

function PageWrapper({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function GuestHome() {
  return (
    <>
      <Hero />
      <LiveDua />
      <DailyHadith />
      <About />
      <Contact />
    </>
  );
}

function DuaRouteElement() {
  const { categoryId } = useParams();
  return (
    <PageWrapper>
      <DuaCategoryPage categoryId={categoryId} />
    </PageWrapper>
  );
}

function AppContent({
  isLoggedIn,
  setIsLoggedIn,
  role,
  setRole,
  showLogoutModal,
  setShowLogoutModal,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldShowFooter = location.pathname === "/";

  const isAdminPage =
    role?.toLowerCase() === "admin" && location.pathname.startsWith("/admin");
  const showNavigation = !isAdminPage;
  const showLiveChat = isLoggedIn && location.pathname === "/";

  const confirmLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setRole("user");
    setShowLogoutModal(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  return (
    <>
      {showNavigation && (
        <Navigation
          isLoggedIn={isLoggedIn}
          setShowLogoutModal={setShowLogoutModal}
        />
      )}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <GuestHome />
              </PageWrapper>
            }
          />
          <Route
            path="/quran"
            element={
              <PageWrapper>
                <QuranPage />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <About />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <Contact />
              </PageWrapper>
            }
          />
          <Route
            path="/livechat"
            element={
              <PageWrapper>
                <LiveChat />
              </PageWrapper>
            }
          />
          <Route
            path="/donation"
            element={
              <PageWrapper>
                <DonationPage />
              </PageWrapper>
            }
          />
          <Route
            path="/prayer-times"
            element={
              <PageWrapper>
                <PrayerTimesTable />
              </PageWrapper>
            }
          />
          <Route
            path="/privacy"
            element={
              <PageWrapper>
                <PrivacyPolicy />
              </PageWrapper>
            }
          />
          <Route
            path="/duas"
            element={
              <PageWrapper>
                <DuaCategoryPage categoryId={null} />
              </PageWrapper>
            }
          />
          <Route
            path="/dua-category/:categoryId/:categorySlug"
            element={<DuaRouteElement />}
          />
          <Route
            path="/hadith"
            element={
              <PageWrapper>
                <Hadith />
              </PageWrapper>
            }
          />
          <Route
            path="/articles"
            element={
              <PageWrapper>
                <ArticlesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/islamic-calendar"
            element={
              <PageWrapper>
                <IslamicCalendar />
              </PageWrapper>
            }
          />
          <Route
            path="/99-names"
            element={
              <PageWrapper>
                <NamesOfAllah />
              </PageWrapper>
            }
          />
          <Route
            path="/video-lectures"
            element={
              <PageWrapper>
                <VideoPlayer />
              </PageWrapper>
            }
          />
          <Route
            path="/lesson-plans"
            element={
              <PageWrapper>
                <LessonPlansPage />
              </PageWrapper>
            }
          />
          <Route
            path="/audio-resources"
            element={
              <PageWrapper>
                <AudioResourcesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/app"
            element={
              <PageWrapper>
                <AppShowcase />
              </PageWrapper>
            }
          />
          <Route
            path="/study-guides"
            element={
              <PageWrapper>
                <StudyGuidesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/qibla-finder"
            element={
              <PageWrapper>
                <QiblaFinder />
              </PageWrapper>
            }
          />
          <Route
            path="/shop"
            element={
              <PageWrapper>
                <ShopPage />
              </PageWrapper>
            }
          />
          <Route
            path="/teaching-tools"
            element={
              <PageWrapper>
                <TeachingToolsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/notifications"
            element={
              <PageWrapper>
                <NotificationCenter />
              </PageWrapper>
            }
          />
          <Route
            path="/ramadan"
            element={
              <PageWrapper>
                <RamadanPage />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <PageWrapper>
                <RegisterPage />
              </PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/verify-email"
            element={
              <PageWrapper>
                <VerifyEmail />
              </PageWrapper>
            }
          />
          {isLoggedIn && (
            <>
              <Route
                path="/profile"
                element={
                  <PageWrapper>
                    <ProfilePage />
                  </PageWrapper>
                }
              />
              <Route
                path="/settings"
                element={
                  <PageWrapper>
                    <SettingsPage />
                  </PageWrapper>
                }
              />

              <Route
                path="/admin/*"
                element={
                  localStorage.getItem("role") === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />

              <Route
                path="/admin/articles"
                element={
                  <PageWrapper>
                    <ArticlesInterface />
                  </PageWrapper>
                }
              />
              <Route
                path="/admin/messages"
                element={
                  <PageWrapper>
                    <AdminMessagesPage />
                  </PageWrapper>
                }
              />
            </>
          )}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>

      {showLogoutModal && (
        <LogoutModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
      )}

      {shouldShowFooter && <Footer />}
      {showLiveChat && <LiveChat />}
      <NetworkStatus />
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role") || "user");
      const currentRole = localStorage.getItem("role");
      if (currentRole === "admin" && window.location.pathname !== "/admin") {
        window.location.href = "/admin";
      }
    };
    checkLogin();
    window.addEventListener("loginStatusChanged", checkLogin);
    return () => window.removeEventListener("loginStatusChanged", checkLogin);
  }, []);

  return (
    <Router>
      <AppContent
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        role={role}
        setRole={setRole}
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
      />
    </Router>
  );
}
