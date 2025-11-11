import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "./Components/Hero";
import LiveDua from "./Components/LiveDua";
import LiveChat from "./Components/LiveChat";
import LiveVideo from "./Components/LiveVideo";
import LiveAudio from "./Components/LiveAudio";
import DailyHadith from "./Components/DailyHadith";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import AuthPages from "./Components/Authentications/AuthPage";
import ForgotPassword from "./Components/Authentications/ForgotPassword";
import ResetPassword from "./Components/Authentications/ResetPassword";
import Navigation from "./Components/Navigation";
import LogoutModal from "./Components/Authentications/LogoutModal";
import PrayerTimesTable from "./Components/PrayerTimesTable";
import Dua from "./Components/DuaList";
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
      <LiveVideo />
      <LiveAudio />
      <About />
      <Contact />
    </>
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
            path="/prayer-times"
            element={
              <PageWrapper>
                <PrayerTimesTable />
              </PageWrapper>
            }
          />
          <Route
            path="/dua"
            element={
              <PageWrapper>
                <Dua />
              </PageWrapper>
            }
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
