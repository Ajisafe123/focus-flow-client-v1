// NotificationCenter.jsx (replace the whole file)

import React, { useState, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "success",
    title: "Welcome to Nibras!",
    message: "Explore authentic Islamic content and resources.",
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Articles Added",
    message: "Check out the latest insights on Islamic lifestyle.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Prayer Time Reminder",
    message: "Maghrib prayer in 15 minutes.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
];

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
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
    case "alert":
      return "bg-amber-50 border-amber-200";
    case "error":
      return "bg-red-50 border-red-200";
    default:
      return "bg-blue-50 border-blue-200";
  }
};

const NotificationItem = ({ n, onRead, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const ago = (ts) => {
    const diff = Math.floor((Date.now() - new Date(ts)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(n.id), 300);
  };

  return (
    <div
      className={`p-4 border-l-4 ${getBg(
        n.type
      )} rounded-r-lg transition-all duration-300 ${
        exiting ? "opacity-0 translate-x-4" : ""
      } ${!n.read ? "bg-white shadow-sm" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(n.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{n.title}</p>
            {!n.read && (
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{n.message}</p>
          <p className="text-xs text-gray-500 mt-2">{ago(n.timestamp)}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!n.read && (
            <button
              onClick={() => onRead(n.id)}
              className="p-1.5 rounded-full hover:bg-gray-200"
              aria-label="Mark as read"
            >
              <CheckCircle className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            onClick={dismiss}
            className="p-1.5 rounded-full hover:bg-gray-200"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NotificationCenter({
  notificationCount: externalCount,
}) {
  const [list, setList] = useState(NOTIFICATIONS);
  const unread = list.filter((n) => !n.read).length;
  const displayCount = externalCount !== undefined ? externalCount : unread;

  const markRead = (id) =>
    setList((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const dismiss = (id) => setList((l) => l.filter((n) => n.id !== id));
  const markAllRead = () =>
    setList((l) => l.map((n) => ({ ...n, read: true })));
  const clearAll = () => setList([]);

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <style>{`.animate-fadeIn{animation:fadeIn .3s ease-out}@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
        <div className="flex gap-2">
          {displayCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Mark all read
            </button>
          )}
          {list.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <button
                onClick={clearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {list.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onRead={markRead}
                onDismiss={dismiss}
              />
            ))}
          </div>
        )}
      </div>

      {list.length > 0 && (
        <div className="p-3 bg-gray-50 border-t text-center">
          <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
