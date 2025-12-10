import React, { useState, useEffect } from "react";
import { Mail, Trash2, Clock, CheckCircle } from "lucide-react";
import PageHeader from "../../Components/Common/PageHeader";
import apiService from "../../Components/Service/apiService";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import EmptyState from "../../Components/Common/EmptyState";

const AdminMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const data = await apiService.getContactMessages(token);
            setMessages(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem("token");
            await apiService.deleteContactMessage(id, token);
            setMessages((prev) => prev.filter((msg) => msg.id !== id));
        } catch (err) {
            alert(err.message || "Failed to delete message");
        }
    };

    if (loading) return <LoadingSpinner fullScreen size="large" message="Loading messages..." />;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <PageHeader
                title="Contact Messages"
                subtitle="Manage inquiries from users"
                icon={Mail}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">
                            {error}
                        </div>
                    )}

                    {messages.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                icon={Mail}
                                title="No messages yet"
                                message="Inquiries sent via the Contact page will appear here."
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                        <th className="px-6 py-4">Sender</th>
                                        <th className="px-6 py-4">Subject</th>
                                        <th className="px-6 py-4">Message</th>
                                        <th className="px-6 py-4 w-32">Date</th>
                                        <th className="px-6 py-4 w-20 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 align-top">
                                                <div className="font-medium text-gray-900">{msg.name}</div>
                                                <div className="text-sm text-gray-500">{msg.email}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top font-medium text-gray-800">
                                                {msg.subject}
                                            </td>
                                            <td className="px-6 py-4 align-top text-gray-600 text-sm whitespace-pre-wrap max-w-md">
                                                {msg.message}
                                            </td>
                                            <td className="px-6 py-4 align-top text-xs text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="mt-1 text-gray-400">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-right">
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessagesPage;
