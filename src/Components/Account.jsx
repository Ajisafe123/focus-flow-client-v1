import React, { useEffect, useState } from "react";
import {
  Mail,
  Key,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Account() {
  const [settings, setSettings] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    statusMessage: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://focus-flow-server-v1.onrender.com/prayers/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setSettings((prev) => ({
          ...prev,
          email: data.email || "",
        }));
      } catch (err) {
        console.error(err);
        setSettings((prev) => ({
          ...prev,
          statusMessage: "Error fetching user info",
        }));
      }
    };

    if (token) fetchUser();
  }, [token]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async () => {
    try {
      const payload = {};
      if (settings.email) payload.email = settings.email;
      if (settings.password) payload.password = settings.password;
      if (settings.confirmPassword)
        payload.confirm_password = settings.confirmPassword;

      const res = await fetch(
        "https://focus-flow-server-v1.onrender.com/auth/account/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to update account");

      setSettings((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        statusMessage: "Account updated successfully!",
      }));

      setTimeout(() => setSettings((p) => ({ ...p, statusMessage: "" })), 3000);
    } catch (err) {
      setSettings((prev) => ({
        ...prev,
        statusMessage: `Error: ${err.message}`,
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://focus-flow-server-v1.onrender.com/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto mt-8">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Profile & Authentication
        </h2>
        <p className="text-gray-500 mt-1">
          Manage and update your account details.
        </p>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="email"
            name="email"
            placeholder="Enter new email"
            value={settings.email}
            onChange={handleChangeInput}
            className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          New Password
        </label>
        <div className="relative">
          <Key className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter new password"
            value={settings.password}
            onChange={handleChangeInput}
            className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Key className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            value={settings.confirmPassword}
            onChange={handleChangeInput}
            className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-12 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      {settings.statusMessage && (
        <div
          className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium ${
            settings.statusMessage.startsWith("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {settings.statusMessage.startsWith("Error") ? (
            <XCircle size={18} className="text-red-500" />
          ) : (
            <CheckCircle size={18} className="text-emerald-500" />
          )}
          {settings.statusMessage}
        </div>
      )}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveAccount}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
      <div className="border-t border-gray-100 pt-6 mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-all duration-200 rounded-2xl text-left border border-transparent hover:border-gray-200"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
            <LogOut className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-base">Logout</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Sign out of your account securely
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}