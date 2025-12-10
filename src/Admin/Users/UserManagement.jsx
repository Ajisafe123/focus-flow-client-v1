import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Users,
  Plus,
  Shield,
  Ban,
  UserCheck,
  Search,
  Edit,
  Trash2,
  Mail,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";

import DeleteModal from "../DeleteModal";
import {UserModal} from "./UserModals";
import {
  fetchUsers,
  deleteUser,
  suspendUser,
  activateUser,
  fetchUserStats,
} from "../apiService";
import LoadingSpinner from "../../Common/LoadingSpinner";

const ActionsDropdown = ({ user, onEdit, onSuspend, onActivate, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const suspended = user.status === "suspended";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-gray-100 rounded-lg"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <button
            onClick={() => {
              onEdit(user);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => {
              (suspended ? onActivate : onSuspend)(user);
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
              suspended ? "text-emerald-600" : "text-orange-600"
            }`}
          >
            {suspended ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <Ban className="w-4 h-4" />
            )}
            {suspended ? "Activate" : "Suspend"}
          </button>
          <button
            onClick={() => {
              onDelete(user);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    editors: 0,
    suspended_users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "add", user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        limit: 100,
        search: searchQuery || undefined,
        role: selectedRole === "all" ? undefined : selectedRole,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      };
      const [usersData, statsData] = await Promise.all([
        fetchUsers(params),
        fetchUserStats(),
      ]);
      setUsers(Array.isArray(usersData.users) ? usersData.users : usersData);
      setStats(statsData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [searchQuery, selectedRole, selectedStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = (mode, user = null) => setModal({ open: true, mode, user });
  const closeModal = () => setModal({ open: false, mode: "add", user: null });

  const openDelete = (user) => setDeleteModal({ open: true, user });
  const closeDelete = () => setDeleteModal({ open: false, user: null });

  const handleDelete = async () => {
    await deleteUser(deleteModal.user.id);
    load();
    closeDelete();
  };

  const handleSuspend = async (user) => {
    await suspendUser(user.id);
    load();
  };

  const handleActivate = async (user) => {
    await activateUser(user.id);
    load();
  };

  const handleSave = () => load();

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="medium" />
      </div>
    );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-10xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              <Users className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" />
              Users Management
            </h1>
            <p className="text-emerald-50 text-xs sm:text-sm md:text-base lg:text-lg">
              Manage platform users, roles, and permissions
            </p>
          </div>
          <button
            onClick={() => openModal("add")}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: Users, title: "Total Users", value: stats.total_users },
          { icon: UserCheck, title: "Active Users", value: stats.active_users },
          { icon: Shield, title: "Editors", value: stats.editors },
          { icon: Ban, title: "Suspended", value: stats.suspended_users },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition border border-gray-100"
            >
              <div className="flex justify-between mb-2 sm:mb-3">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">
                {s.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                {s.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-5 md:p-6 border-b border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">User List</h3>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex items-start gap-3 flex-1 cursor-pointer"
                    onClick={() => openModal("view", user)}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : user.role === "editor"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          <Shield className="w-3 h-3 inline mr-1" /> {user.role}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : user.status === "suspended"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ActionsDropdown
                    user={user}
                    onEdit={() => openModal("edit", user)}
                    onSuspend={handleSuspend}
                    onActivate={handleActivate}
                    onDelete={openDelete}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => openModal("add")}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition group"
            >
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Add New User</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition" />
            </button>
          </div>
        </div>
      </div>

      <UserModal
        show={modal.open}
        onClose={closeModal}
        user={modal.user}
        mode={modal.mode}
        onSave={handleSave}
      />

      <DeleteModal
        show={deleteModal.open}
        onClose={closeDelete}
        onDelete={handleDelete}
        itemTitle={deleteModal.user?.username || ""}
        itemType="User"
        warningText="All user data will be permanently deleted."
      />
    </div>
  );
};

export default UsersManagement;
