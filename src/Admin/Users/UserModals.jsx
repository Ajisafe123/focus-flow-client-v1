import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Edit,
  Ban,
  Shield,
} from "lucide-react";

import { createUser, updateUser } from "../apiService";

const GRADIENT_CLASS = "bg-gradient-to-br from-emerald-600 to-teal-700";

export const UserModal = ({
  show,
  onClose,
  onSave,
  user = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) return;

    if (mode === "edit" || mode === "view") {
      setFormData({
        username: user?.username || "",
        email: user?.email || "",
        password: "",
        role: user?.role || "user",
        status: user?.status || "active",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "user",
        status: "active",
      });
    }
    setError("");
  }, [show, user, mode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "view") return;

    setIsLoading(true);
    setError("");

    try {
      const payload = { ...formData };
      if (mode === "edit" && !payload.password) {
        delete payload.password;
      }

      let savedUser;
      if (mode === "edit") {
        savedUser = await updateUser(user.id, payload);
      } else {
        savedUser = await createUser(payload);
      }

      onSave?.(savedUser);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  if (mode === "view") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div
            className={`bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 p-6 sticky top-0 flex justify-between items-center rounded-t-2xl`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">User Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{user?.username}</h3>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs uppercase text-gray-500">Role</p>
                <p className="font-bold capitalize flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-emerald-600" /> {user?.role}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs uppercase text-gray-500">Status</p>
                <span
                  className={`mt-1 px-3 py-1 rounded-full text-sm font-bold ${
                    user?.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : user?.status === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user?.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => onSave?.(user, "edit")}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                <Edit className="w-4 h-4" /> Edit User
              </button>
              {user?.status === "active" ? (
                <button
                  onClick={() => onSave?.(user, "suspend")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  <Ban className="w-4 h-4" /> Suspend
                </button>
              ) : (
                <button
                  onClick={() => onSave?.(user, "activate")}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  <UserCheck className="w-4 h-4" /> Activate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div
          className={`bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 p-6 flex justify-between items-center rounded-t-2xl`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {mode === "edit" ? "Edit User" : "Add New User"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password{" "}
              {mode === "edit" && (
                <span className="text-xs text-gray-500">
                  (leave blank to keep)
                </span>
              )}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required={mode === "add"}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm transition-all"
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3 text-white rounded-lg font-semibold transition-all duration-200 ${
                isLoading ? "bg-gray-400" : "bg-gradient-to-br from-emerald-500 to-green-600 hover:shadow-lg hover:scale-105"
              }`}
            >
              {isLoading
                ? "Saving..."
                : mode === "edit"
                ? "Save Changes"
                : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
