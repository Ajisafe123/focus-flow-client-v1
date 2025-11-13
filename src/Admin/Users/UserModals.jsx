import React, { useState, useEffect } from "react";
import {
  UserCheck,
  Edit,
  Trash2,
  Calendar,
  BookOpen,
  MessageSquare,
  X,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Ban,
} from "lucide-react";

const API_BASE = "https://focus-flow-server-v1.onrender.com";
export const DeleteConfirmModal = ({
  show,
  onClose,
  onDelete,
  itemTitle,
  itemType = "User",
  warningText = null,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Delete {itemType}: "{itemTitle}"?
          </h3>
          <p className="text-gray-600 text-sm">
            Are you sure you want to delete "{itemTitle}"? This action cannot be
            undone.
          </p>
          {warningText && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-semibold text-sm">
                Warning: {warningText}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold hover:shadow-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const UserDetailsModal = ({
  show,
  onClose,
  user,
  onEdit,
  onSuspend,
  onActivate,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!show || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100">
        <div className="sticky top-0 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-t-xl shadow-md z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-6 h-6" /> User Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user.username
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {user.username}
              </h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Role
              </label>
              <div className="mt-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-gray-900 capitalize">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Status
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    user.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : user.status === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                Username
              </label>
              <p className="mt-1 font-semibold text-gray-900">
                {user.username || "N/A"}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="text-xs font-semibold text-gray-500 uppercase">
                User ID
              </label>
              <p className="mt-1 font-mono text-sm text-gray-900">{user.id}</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <label className="text-xs font-semibold text-amber-700 uppercase flex items-center gap-2">
              <Lock className="w-4 h-4" /> Hashed Password
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={user.hashed_password || "Not available"}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm font-mono"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">
                {user.articles_count || 0}
              </p>
              <p className="text-xs text-blue-700 font-semibold">Articles</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
              <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">
                {user.comments_count || 0}
              </p>
              <p className="text-xs text-purple-700 font-semibold">Comments</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg text-center">
              <Calendar className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p className="text-xs text-emerald-700 font-semibold">Joined</p>
            </div>
          </div>
          {(user.bio || user.city || user.country) && (
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <h4 className="font-bold text-gray-900">
                Additional Information
              </h4>
              {user.bio && (
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    Bio
                  </label>
                  <p className="text-sm text-gray-700 mt-1">{user.bio}</p>
                </div>
              )}
              {(user.city || user.country) && (
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    Location
                  </label>
                  <p className="text-sm text-gray-700 mt-1">
                    {[user.city, user.region, user.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                onEdit(user);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              <Edit className="w-4 h-4" />
              Edit User
            </button>
            {user.status === "active" ? (
              <button
                onClick={() => {
                  onSuspend(user);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                <Ban className="w-4 h-4" />
                Suspend User
              </button>
            ) : (
              <button
                onClick={() => {
                  onActivate(user);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold"
              >
                <UserCheck className="w-4 h-4" />
                Activate User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddUserModal = ({
  show,
  onClose,
  onUserAdded,
  isEdit = false,
  userData = null,
}) => {
  const INITIAL_FORM = {
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      if (isEdit && userData) {
        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          password: "",
          role: userData.role || "user",
          status: userData.status || "active",
        });
      } else {
        setFormData(INITIAL_FORM);
      }
      setError("");
    }
  }, [show, isEdit, userData]);

  if (!show) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in as admin.");
        setIsLoading(false);
        return;
      }

      const payload = { ...formData };
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      const url = isEdit
        ? `${API_BASE}/api/admin/users/${userData.id}`
        : `${API_BASE}/api/admin/users`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Failed to save user");
      }

      const newUser = await response.json();
      onUserAdded?.(newUser);
      setFormData(INITIAL_FORM);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full shadow-2xl border border-emerald-100 flex flex-col overflow-y-auto max-h-[90vh]">
        <div className="sticky top-0 p-4 flex items-center justify-between bg-gradient-to-br from-emerald-600 to-teal-700 rounded-t-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5" />{" "}
            {isEdit ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex-grow space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium">
              Error {error}
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">
              Password{" "}
              {isEdit && (
                <span className="text-gray-500">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required={!isEdit}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="user">User</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-md ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-emerald-600 to-teal-700 hover:opacity-90 transition-opacity"
              }`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
