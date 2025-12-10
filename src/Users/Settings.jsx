import React, { useState, useEffect } from "react";
import { ListRestart, UserCheck, LockKeyhole, Settings } from "lucide-react";
import General from "./General";
import Account from "./Account";
import Security from "./Security";
import LoadingSpinner from "../Common/LoadingSpinner";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  buttonText,
  buttonColor,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 border-2 border-gray-100">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 mb-8 text-base leading-relaxed">
            {message}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all duration-200 shadow-lg ${
                buttonColor === "red"
                  ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-emerald-200"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    soundEnabled: true,
    notificationsEnabled: true,
    language: "en",
    calculationMethod: "mwl",
    autoLocation: true,
    hapticsEnabled: false,
    timeFormat: "24h",
    twoFactorEnabled: false,
    email: "user@example.com",
    password: "",
    confirmPassword: "",
    statusMessage: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    buttonText: "Confirm",
    buttonColor: "red",
  });

  useEffect(() => {
    setSettings((s) => ({
      ...s,
      password: "",
      confirmPassword: "",
    }));
    setLoading(false);
  }, []);

  const handleToggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));
  const handleSelectChange = (key, value) =>
    setSettings((s) => ({ ...s, [key]: value }));
  const handleChangeInput = (e) =>
    setSettings((s) => ({
      ...s,
      [e.target.name]: e.target.value,
      statusMessage: "",
    }));

  const handleSaveAccount = () => {
    if (settings.password && settings.password !== settings.confirmPassword)
      return setSettings({
        ...settings,
        statusMessage: "Error: Passwords do not match.",
      });
    setSettings({
      ...settings,
      statusMessage: "Account settings saved successfully.",
      password: "",
      confirmPassword: "",
    });
  };

  const openModal = (title, message, onConfirm, buttonText, buttonColor) =>
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeModal();
      },
      buttonText,
      buttonColor,
    });

  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleClearData = () =>
    openModal(
      "Confirm Data Deletion",
      "This will permanently remove all stored settings and cannot be undone.",
      () => window.location.reload(),
      "Clear Data",
      "red"
    );

  const handleLogout = () =>
    openModal(
      "Confirm Logout",
      "Are you sure you want to log out of your account?",
      () => (window.location.href = "/"),
      "Logout",
      "red"
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="large" message="Loading Settings..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 font-sans">
      <ConfirmationModal {...modal} onCancel={closeModal} />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700">
              Settings
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-64">
            <nav className="flex flex-wrap justify-center lg:flex-col gap-2 p-3 bg-white rounded-2xl shadow-xl border-2 border-gray-100">
              {["general", "account", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200"
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {tab === "general" && <ListRestart className="w-5 h-5" />}
                  {tab === "account" && <UserCheck className="w-5 h-5" />}
                  {tab === "security" && <LockKeyhole className="w-5 h-5" />}
                  <span className="hidden sm:inline lg:inline">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-grow">
            <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
              {activeTab === "general" && (
                <General
                  settings={settings}
                  handleToggle={handleToggle}
                  handleSelectChange={handleSelectChange}
                />
              )}
              {activeTab === "account" && (
                <Account
                  settings={settings}
                  handleChangeInput={handleChangeInput}
                  handleSaveAccount={handleSaveAccount}
                  handleLogout={handleLogout}
                />
              )}
              {activeTab === "security" && (
                <Security
                  settings={settings}
                  handleToggle={handleToggle}
                  handleClearData={handleClearData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
