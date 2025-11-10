import React, { useState } from "react";
import { LogOut, AlertCircle, Check, Loader2 } from "lucide-react";
import apiService from "../Services/api";

const LogoutInterface = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await apiService.logout();
      setShowLogoutModal(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.href = "/admin/login";
      }, 1800);
    } catch {
      alert("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg max-w-sm w-full p-6 text-center animate-scaleIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout from{" "}
              <span className="text-emerald-600 font-medium">
                Nibras Al-Deen
              </span>{" "}
              admin dashboard?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
            <div className="mt-5 flex items-start gap-2 p-3 bg-gray-100 rounded-lg">
              <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-600 text-left">
                Your session will be terminated and unsaved changes may be lost.
              </p>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg max-w-sm w-full p-6 text-center animate-scaleIn">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Logged Out
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              You have been successfully logged out.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-progressBar"></div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Redirecting to login page...
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-progressBar {
          animation: progressBar 1.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LogoutInterface;
