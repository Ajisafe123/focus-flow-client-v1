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
import Hero from "./Components/Hero";
import LiveDua from "./Components/LiveDua";
import LiveArticles from "./Components/LiveArticles";
import LiveChat from "./Components/LiveChat";
import DailyHadith from "./Components/DailyHadith";
import About from "./Components/About";
import Contact from "./Components/Contact";
import DonationPage from "./Components/DonationPage";
import Footer from "./Components/Footer";
import AuthPages from "./Components/Authentications/AuthPage";
import ForgotPassword from "./Components/Authentications/ForgotPassword";
import ResetPassword from "./Components/Authentications/ResetPassword";
import Navigation from "./Components/Navigation";
import LogoutModal from "./Components/Authentications/LogoutModal";
import PrayerTimesTable from "./Components/PrayerTimesTable";
import Hadith from "./Components/HadithList";
import IslamicCalendar from "./Components/IslamicCalendar";
import NamesOfAllah from "./Components/NamesOfAllah";
import ZakatCalculator from "./Components/ZakatCalculator";
import QiblaFinder from "./Components/QiblaFinder";
import SettingsPage from "./Components/Settings";
import ProfilePage from "./Components/Profile";
import AdminDashboard from "./Admin/NibrasAdminDashboard";
import apiService from "./Services/api";
import ArticlesInterface from "./Admin/ArticlesInterface";
import QuranPage from "./Components/Quran";
import DuaCategoryPage from "./Components/DuaList";
import ArticlesPage from "./Components/ArticlesPage";
import LiveVideo from "./Components/LiveVideo";
import VideoPlayer from "./Components/VideoPlayer"
import ShopPage from "./Components/ShopPage";
import TeachingToolsPage from "./Components/TeachingToolsPage";
import LessonPlansPage from "./Components/LessonPlansPage";
import AudioResourcesPage from "./Components/AudioResourcesPage";
import StudyGuidesPage from "./Components/StudyGuidesPage";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import AppShowcase from "./Components/AppShowCase";
import NotificationCenter from "./Components/Notification";
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
      <LiveArticles />
      <LiveVideo />
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
    role === "admin" && location.pathname.startsWith("/admin");
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
            path="/videos"
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
            path="/zakat-calculator"
            element={
              <PageWrapper>
                <ZakatCalculator />
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
            path="/login"
            element={
              <PageWrapper>
                <AuthPages />
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
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
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
