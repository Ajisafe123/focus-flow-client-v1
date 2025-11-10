import React, { useState } from "react";
import { X, Loader2, UserCheck, } from "lucide-react";

const GRADIENT_CLASS = "bg-gradient-to-br from-emerald-600 to-teal-700";
const HOVER_GRADIENT_CLASS = "hover:opacity-90 transition-opacity";

const AddUserModal = ({
  show,
  onClose,
  API_BASE = "http://localhost:8000",
  onUserAdded,
}) => {
  const INITIAL_FORM = {
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Failed to add user");
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

        <div
          className={`sticky top-0 p-4 flex items-center justify-between ${GRADIENT_CLASS} rounded-t-xl`}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5" /> Add New User
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
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="font-medium text-gray-700 text-sm">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
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
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
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
                  : `${GRADIENT_CLASS} ${HOVER_GRADIENT_CLASS}`
              }`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;

