import React, { useState, useEffect, useMemo } from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Trash2,
} from "lucide-react";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
} from "./Service/apiService";

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    case "warning":
    case "alert":
      return <AlertCircle className="w-5 h-5 text-amber-600" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

const getBg = (type) => {
  switch (type) {
    case "success":
      return "bg-emerald-50 border-emerald-200";
    case "warning":
    case "alert":
      return "bg-amber-50 border-amber-200";
    case "error":
      return "bg-red-50 border-red-200";
    default:
      return "bg-blue-50 border-blue-200";
  }
};

const ago = (ts) => {
  try {
    // Parse timestamp - handle both ISO and Unix formats
    let date = new Date(ts);
    
    // If timestamp is a number (Unix timestamp in milliseconds or seconds)
    if (typeof ts === 'number') {
      // If it's less than 10^11, it's likely in seconds, convert to milliseconds
      date = new Date(ts < 10000000000 ? ts * 1000 : ts);
    }
    
    // Validate the date
    if (isNaN(date.getTime())) {
      return "Recently";
    }
    
    const now = Date.now();
    const diffMs = now - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    
    // For older notifications, show the actual date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (err) {
    console.error('Error parsing notification time:', err);
    return "Recently";
  }
};

const NotificationItem = ({ n, onRead, onDelete }) => {
  const [timeAgo, setTimeAgo] = useState(ago(n.created_at));

  useEffect(() => {
    setTimeAgo(ago(n.created_at));
    const interval = setInterval(() => {
      setTimeAgo(ago(n.created_at));
    }, 60000);
    return () => clearInterval(interval);
  }, [n.created_at]);

  const handleLinkClick = (e) => {
    if (n.link) {
      onRead(n.id);
      // Ensure proper navigation format
      if (!n.link.startsWith("/")) {
        e.preventDefault();
        window.location.href = "/" + n.link;
      }
    }
  };

  return (
    <div
      className={`p-4 border-l-4 ${getBg(
        n.type
      )} rounded-r-lg transition-all duration-300 ${!n.read ? "bg-white" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{n.title}</p>
            {!n.read && (
              <button
                onClick={() => onRead(n.id)}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Mark read
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{n.message}</p>
          <p className="text-xs text-gray-500 mt-2">{timeAgo}</p>
          {n.link && (
            <a
              href={n.link.startsWith("/") ? n.link : "/" + n.link}
              onClick={handleLinkClick}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-block mt-2"
            >
              Open Article →
            </a>
          )}
        </div>
        <button
          onClick={() => onDelete(n.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function NotificationCenter() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useMemo(() => localStorage.getItem("token"), []);

  const load = async () => {
    if (!token) {
      setError("Please login to view notifications.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchNotifications(token);
      setList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const unread = list.filter((n) => !n.read).length;

  const markAll = async () => {
    if (!token) return;
    try {
      await markAllNotificationsRead(token);
      setList((l) => l.map((n) => ({ ...n, read: true })));
    } catch (err) {
      setError(err.message || "Failed to mark all as read");
    }
  };

  const markOne = async (id) => {
    if (!token) return;
    try {
      await markNotificationRead(id, token);
      setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      setError(err.message || "Failed to mark notification");
    }
  };

  const removeOne = async (id) => {
    if (!token) return;
    if (!window.confirm("Delete this notification?")) return;
    try {
      await deleteNotification(id, token);
      setList((l) => l.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      // If 404, still remove from UI since it doesn't exist on server
      if (err.status === 404) {
        setList((l) => l.filter((n) => n.id !== id));
      } else {
        setError(err.message || "Failed to delete notification");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-6">
      <style>{`.animate-fadeIn{animation:fadeIn .3s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          {unread > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              {unread} new
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="p-6 flex items-center justify-center text-gray-500">
          <LoadingSpinner size="small" />
        </div>
      ) : (
        <div className="max-h-[460px] overflow-y-auto divide-y divide-gray-100">
          {list.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            list.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={markOne}
                onDelete={removeOne}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
