import React, { useState } from "react";
import apiService from "../Service/apiService";
import { LogOut, CheckCircle, XCircle, Loader } from "lucide-react"; 

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await apiService.logout();

      setSuccess(true);

      setTimeout(async () => {
        setIsLoading(false);
        setSuccess(false);

        try {
          await onConfirm();
        } catch (parentError) {
          console.error("Parent cleanup failed:", parentError);
          onClose();
        }
      }, 1000);
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please check your connection or try again.");
      setIsLoading(false);

      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      
      <div className="bg-white border border-emerald-700 p-8 w-80 text-white shadow-2xl shadow-emerald-900/50 relative transform transition-all duration-300">
      
        <div className="flex items-center justify-center mb-4 text-emerald-500">
          <LogOut className="w-7 h-7 mr-3" />
          <h2 className="text-xl font-semibold tracking-wide">
            CONFIRM LOGOUT
          </h2>
        </div>
        <div className="w-full h-px bg-emerald-700/50 mb-6"></div>{" "}

        {!isLoading && !success && !error && (
          <>
            <p className="mb-8 text-black">
              Are you sure you want to end your current session?
            </p>

            <div className="flex justify-between gap-4">
            
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white text-green-900 font-medium hover:bg-green-800 transition-colors border border-black hover:text-white"
              >
                Cancel
              </button>
             
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-800 text-white font-semibold hover:bg-red-700 transition-colors border border-red-800 hover:border-red-700"
              >
                Log Out
              </button>
            </div>
          </>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4">
           
            <Loader className="animate-spin h-10 w-10 text-emerald-900 mb-4" />
            <span className="text-lg font-medium text-emerald-900">
              Processing logout...
            </span>
          </div>
        )}
        {success && (
          <div className="py-4">
            <CheckCircle className="h-10 w-10 text-green-800 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-green-800">Session Ended</h2>
            <p className="text-sm text-black mt-2">
              Logged out successfully. Redirecting...
            </p>
          </div>
        )}
        {error && (
          <div className="py-4">
            <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
            <p className="text-sm text-gray-300 mb-4">{error}</p>
            <button
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-700 text-white font-medium hover:bg-red-600 transition border border-red-700"
            >
              Retry Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutModal;
