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
  Calendar,
  ArrowUpRight,
  MessageSquare,
  BookOpen,
  MoreVertical,
} from "lucide-react";
import {
  DeleteConfirmModal,
  UserDetailsModal,
  AddUserModal,
} from "./UserModals";
import {
  fetchUsers,
  deleteUser,
  suspendUser,
  activateUser,
  fetchUserStats,
} from "./userApi";
const ActionsDropdown = ({ user, onEdit, onSuspend, onActivate, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action, e) => {
    e.stopPropagation();
    action(user);
    setIsOpen(false);
  };
  const isSuspended = user && user.status === "suspended";

  const SuspendActivateIcon = isSuspended ? UserCheck : Ban;
  const SuspendActivateText = isSuspended ? "Activate User" : "Suspend User";
  const SuspendActivateAction = isSuspended ? onActivate : onSuspend;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        title="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
          <div className="py-1">
            <button
              onClick={(e) => handleAction(onEdit, e)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </button>
            <button
              onClick={(e) => handleAction(SuspendActivateAction, e)}
              className={`flex items-center w-full px-4 py-2 text-sm ${
                isSuspended ? "text-emerald-600" : "text-orange-600"
              } hover:bg-gray-100`}
            >
              <SuspendActivateIcon className="w-4 h-4 mr-2" />
              {SuspendActivateText}
            </button>
            <button
              onClick={(e) => handleAction(onDelete, e)}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </button>
          </div>
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
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        limit: 100,
        offset: 0,
        search: searchQuery || undefined,
        role: selectedRole === "all" ? undefined : selectedRole,
        status: selectedStatus === "all" ? undefined : selectedStatus,
      };

      const data = await fetchUsers(params);
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedRole, selectedStatus]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await fetchUserStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStats({
        total_users: 0,
        active_users: 0,
        editors: 0,
        suspended_users: 0,
      });
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleDeleteConfirmed = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      await Promise.all([loadUsers(), loadStats()]);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "Failed to delete user");
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleSuspendUser = async (user) => {
    try {
      await suspendUser(user.id);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: "suspended" } : u
        )
      );
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setError(err.message || "Failed to suspend user");
    }
  };
  const handleActivateUser = async (user) => {
    try {
      await activateUser(user.id);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, status: "active" } : u
        )
      );
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setError(err.message || "Failed to activate user");
    }
  };

  const handleUserSaved = async () => {
    await Promise.all([loadUsers(), loadStats()]);
  };

  const statsCards = [
    {
      icon: Users,
      title: "Total Users",
      value: stats.total_users,
    },
    {
      icon: UserCheck,
      title: "Active Users",
      value: stats.active_users,
    },
    {
      icon: Shield,
      title: "Editors",
      value: stats.editors,
    },
    {
      icon: Ban,
      title: "Suspended",
      value: stats.suspended_users,
    },
  ];

  const getRoleBadge = (role) => {
    const badges = {
      admin: "bg-purple-50 text-purple-700 border-purple-200",
      editor: "bg-blue-50 text-blue-700 border-blue-200",
      user: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return badges[role] || badges.user;
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      inactive: "bg-gray-50 text-gray-700 border-gray-200",
      suspended: "bg-red-50 text-red-700 border-red-200",
    };
    return badges[status] || badges.active;
  };

  const handleQuickStatusFilter = (status) => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus(status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-emerald-600 font-semibold">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Users className="w-7 h-7 sm:w-9 sm:h-9" />
              Users Management
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base md:text-lg">
              Manage platform users, roles, and permissions
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-5 hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <h3 className="text-gray-500 text-xs font-semibold mb-1 uppercase tracking-wide">
                {stat.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">User List</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {users.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm sm:text-base">
                          {user.username
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                          {user.username}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mb-2">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadge(
                              user.role
                            )}`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                              user.status
                            )}`}
                          >
                            {user.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {user.articles_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {user.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <ActionsDropdown
                        user={user}
                        onEdit={handleEditUser}
                        onSuspend={handleSuspendUser}
                        onActivate={handleActivateUser}
                        onDelete={handleDeleteUser}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">Add New User</span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleQuickStatusFilter("active")}
              className="w-full flex items-center gap-3 p-3.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-1.5 bg-white/20 rounded-md group-hover:bg-white/30 transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                Active Users ({stats.active_users})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleQuickStatusFilter("suspended")}
              className="w-full flex items-center gap-3 p-3.5 border-2 border-red-100 bg-red-50 text-red-700 rounded-lg hover:border-red-200 hover:bg-red-100 transition-all duration-200 group"
            >
              <div className="p-1.5 bg-red-100 rounded-md group-hover:bg-red-200 transition-colors">
                <Ban className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                Suspended ({stats.suspended_users})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => handleQuickStatusFilter("editor")}
              className="w-full flex items-center gap-3 p-3.5 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 rounded-lg hover:border-emerald-200 hover:bg-emerald-100 transition-all duration-200 group"
            >
              <div className="p-1.5 bg-emerald-100 rounded-md group-hover:bg-emerald-200 transition-colors">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-semibold text-sm">
                Editors ({stats.editors})
              </span>
              <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={handleUserSaved}
        isEdit={false}
      />

      <AddUserModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onUserAdded={handleUserSaved}
        isEdit={true}
        userData={selectedUser}
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onDelete={handleDeleteConfirmed}
        itemTitle={selectedUser?.username || ""}
        itemType="User"
        warningText="All user data, articles, and comments will be permanently deleted."
      />

      <UserDetailsModal
        show={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onEdit={handleEditUser}
        onSuspend={handleSuspendUser}
        onActivate={handleActivateUser}
      />
    </div>
  );
};

export default UsersManagement;
