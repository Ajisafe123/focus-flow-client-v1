import React, { useState } from "react";
import apiService from "../Service/apiService";
import { LogOut, AlertCircle } from "lucide-react";
import LoadingSpinner from "../Common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await apiService.logout();
      // Wait a brief moment for visual feedback
      setTimeout(async () => {
        setIsLoading(false);
        try {
          await onConfirm();
        } catch (error) {
          console.error("Cleanup failed:", error);
          onClose();
        }
      }, 800);
    } catch (err) {
      console.error("Logout failed:", err);
      // Force logout anyway on error to prevent being stuck
      onConfirm();
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
        >
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-8 h-8 text-red-500 ml-1" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Sign Out?
            </h3>

            <p className="text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to end your current session? You'll need to sign in again to access your account.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                  </>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LogoutModal;
