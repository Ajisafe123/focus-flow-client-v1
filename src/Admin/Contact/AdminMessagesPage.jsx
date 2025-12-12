import React, { useState, useEffect } from "react";
import { Mail, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import apiService from "../../Components/Service/apiService";
import LoadingSpinner from "../../Components/Common/LoadingSpinner";
import PageHeader from "../Components/PageHeader";
import ModalButton from "../Components/ModalButton";

const AdminMessagesPage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner message="Loading messages..." />
        </div>
    );

    return (
        <div className="space-y-6 max-w-10xl mx-auto">
            <PageHeader
                title="Contact Messages"
                subtitle="Manage customer inquiries and messages"
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {error && (
                    <div className="p-4 sm:p-6 bg-red-50 border-b border-red-100">
                        <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            No messages yet
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Inquiries sent via the Contact page will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages.map((msg) => (
                            <div key={msg.id || msg.email} className="border border-gray-100 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedId(expandedId === (msg.id || msg.email) ? null : (msg.id || msg.email))}
                                    className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{msg.email}</p>
                                        <p className="text-xs text-gray-500 truncate">{msg.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2">
                                        {expandedId === (msg.id || msg.email) ? (
                                            <ChevronUp className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {expandedId === (msg.id || msg.email) && (
                                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                                            <p className="text-sm text-gray-900">{msg.subject}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</p>
                                            <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(msg.created_at).toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessagesPage;
