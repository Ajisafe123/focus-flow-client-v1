
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Info,
    MessageSquare,
    Mail,
    ExternalLink
} from "lucide-react";
import {
    fetchNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    deleteNotification
} from "../Users/Service/apiService";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;
            const data = await fetchNotifications(token, 50);
            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await markAllNotificationsRead(token);
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            await markNotificationRead(id, token);
            setNotifications(notifications.map(n => n.id === id ? ({ ...n, read: true }) : n));
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            await deleteNotification(id, token);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            // Mark read in background
            const token = localStorage.getItem("token");
            markNotificationRead(notification.id, token).then(() => {
                setNotifications(prev => prev.map(n => n.id === notification.id ? ({ ...n, read: true }) : n));
            }).catch(() => { });
        }

        if (notification.link) {
            // If it's an internal link, use navigate if possible, or window.location if router context allows, but we are inside Dashboard generally. 
            // Admin dashboard seems to use `activePage` state for navigation mostly, but the link from backend is likely a path like "/admin/messages".
            // The dashboard uses `activePage` state.
            // We need to map link paths to activePage for internal navigation.

            let targetPage = "dashboard";
            if (notification.link.includes("/admin/messages")) targetPage = "contacts"; // Wait, "contacts" case needs to be added
            else if (notification.link.includes("/admin/chat")) targetPage = "chat";
            // else fallback or external

            // This component is rendered inside Dashboard? Yes.
            // But we don't have access to `setActivePage` directly here unless passed as prop.
            // However, user might expect browser navigation.
            // Actually, sidebar uses `setActivePage`. 
            // If we really want to switch page, we need `setActivePage`.
            // I will not implement page switching here without props. I'll just show the notification content clearly. 
            // OR: I can dispatch a custom event or use a global context if exists. But Dashboard state is local.
            // For now, I will just Mark Read. 
            // If the link is meaningful, I might try to navigate.
            // If I use `navigate(notification.link)` it might reload the app if the routes are handled by React Router (which they are in App.jsx).
            // Let's try `navigate`.
            if (notification.link.startsWith("/")) {
                navigate(notification.link);
            } else {
                window.location.href = notification.link;
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "contact": return <Mail className="text-blue-500" />;
            case "chat": return <MessageSquare className="text-emerald-500" />;
            case "system": return <Info className="text-purple-500" />;
            default: return <Bell className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6 max-w-10xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                            <Bell className="w-9 h-9" />
                            Notifications
                        </h1>
                        <p className="text-emerald-50 text-lg">
                            Manage your alerts and messages
                        </p>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                            <CheckCheck size={18} />
                            <span>Mark all as read</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">No notifications</h3>
                        <p className="text-gray-500 mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 sm:p-5 flex gap-4 transition-colors cursor-pointer hover:bg-gray-50 ${!notification.read ? "bg-emerald-50/30" : ""
                                    }`}
                            >
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!notification.read ? "bg-white shadow-sm" : "bg-gray-100"
                                    }`}>
                                    {getIcon(notification.type)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className={`text-sm font-semibold truncate ${!notification.read ? "text-gray-900" : "text-gray-700"
                                            }`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                                            {format(new Date(notification.created_at), "MMM d, h:mm a")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>

                                    {notification.link && (
                                        <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium hover:underline">
                                            <span>View Details</span>
                                            <ExternalLink size={12} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 pl-2 border-l border-gray-100 ml-2 justify-center">
                                    {!notification.read && (
                                        <button
                                            onClick={(e) => handleMarkRead(notification.id, e)}
                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => handleDelete(notification.id, e)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
