import React, { useState, useEffect, useRef } from "react";
import { Search, Send, MessageCircle, ArrowLeft, Users } from "lucide-react";
import { API_BASE_URL, getWebSocketUrl } from "../../services/api";

const AdminChatInterface = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMobileList, setShowMobileList] = useState(true);

    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const selectedConvIdRef = useRef(null);
    const processedMessageIds = useRef(new Set());

    const authHeaders = () => {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/conversations?limit=100`, {
                    headers: authHeaders(),
                });
                const data = await res.json();

                const userMap = new Map();
                data.forEach((c) => {
                    const email = c.user_email?.toLowerCase();
                    if (!email) return;
                    if (!userMap.has(email) || new Date(c.updated_at) > new Date(userMap.get(email).updated_at)) {
                        userMap.set(email, c);
                    }
                });

                const formatted = Array.from(userMap.values()).map((c) => ({
                    id: c.id,
                    name: c.user_name || "User",
                    email: c.user_email || "N/A",
                    avatar: (c.user_name || "U").slice(0, 2).toUpperCase(),
                    lastMessage: c.last_message || "",
                    time: new Date(c.updated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                }));

                setConversations(formatted);
                if (formatted.length > 0) {
                    setSelectedConv(formatted[0]);
                    setShowMobileList(false);
                }
            } catch (err) {
                console.error("Failed to load conversations", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    useEffect(() => {
        selectedConvIdRef.current = selectedConv?.id;
    }, [selectedConv]);

    useEffect(() => {
        if (!selectedConv?.id) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/api/messages/${selectedConv.id}/messages`,
                    { headers: authHeaders() }
                );
                const data = await res.json();

                const formatted = data.map((m) => ({
                    id: m.id || m._id,
                    text: m.message_text,
                    sender: m.sender_type,
                    time: new Date(m.created_at || Date.now()).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                }));

                setMessages(formatted);

                await fetch(`${API_BASE_URL}/api/messages/${selectedConv.id}/read`, {
                    method: "POST",
                    headers: authHeaders(),
                }).catch(() => { });
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        fetchMessages();
    }, [selectedConv?.id]);

    useEffect(() => {
        // Close any existing connection before creating a new one (prevents React StrictMode duplicates)
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const wsUrl = getWebSocketUrl("/ws/chat/admin");
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const { event: evt, data } = JSON.parse(event.data);

                if (evt === "receive_message") {
                    const { conversation_id, sender_type, id, message_text, created_at } = data;

                    // Skip messages sent by admin - they're already added optimistically via handleSend
                    if (sender_type === "admin") {
                        return;
                    }

                    if (String(selectedConvIdRef.current) === String(conversation_id)) {
                        const newMsg = {
                            id,
                            text: message_text,
                            sender: sender_type,
                            time: new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        };

                        setMessages((prev) => {
                            // Check for duplicates (in case of multiple WebSocket connections)
                            if (prev.some((m) => String(m.id) === String(id))) {
                                return prev;
                            }
                            return [...prev, newMsg];
                        });
                    }

                    setConversations((prev) => {
                        const idx = prev.findIndex((c) => String(c.id) === String(conversation_id));
                        if (idx === -1) return prev;

                        const updated = {
                            ...prev[idx],
                            lastMessage: message_text || "",
                            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                        };

                        return [updated, ...prev.filter((c) => String(c.id) !== String(conversation_id))];
                    });
                }
            } catch (err) {
                console.error("Admin WS error:", err);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = () => {
            // Silent error handling
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    }, []);

    const handleSend = async () => {
        if (!message.trim() || !selectedConv) return;

        const msgText = message.trim();
        const tempId = `temp-${Date.now()}`;

        const newMsg = {
            id: tempId,
            text: msgText,
            sender: "admin",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Mark temp ID as processed to prevent WebSocket from adding it again
        processedMessageIds.current.add(tempId);

        setMessages((prev) => [...prev, newMsg]);
        setMessage("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    conversationId: selectedConv.id,
                    text: msgText,
                    senderId: null,
                    senderType: "admin",
                    messageType: "text",
                }),
            });

            const data = await res.json();

            // Mark real ID as processed too
            processedMessageIds.current.add(String(data.id));

            setMessages((prev) =>
                prev.map((m) => (m.id === tempId ? { ...m, id: data.id } : m))
            );
        } catch (err) {
            console.error("Send failed:", err);
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
            // Remove from processed if failed
            processedMessageIds.current.delete(tempId);
        }
    };

    const filteredConvs = conversations.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-white" />
                    <h1 className="text-base sm:text-lg font-bold text-white">Chat Management</h1>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`}></span>
                    <span className="text-white text-xs font-medium">{isConnected ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex" style={{ height: 'calc(100% - 52px)' }}>
                {/* Desktop */}
                <div className="hidden lg:flex w-full h-full">
                    {/* Conversations */}
                    <div className="w-[350px] border-r flex flex-col h-full">
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                </div>
                            ) : filteredConvs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                                    <Users className="w-12 h-12 mb-2 opacity-20" />
                                    <p className="text-sm">No conversations</p>
                                </div>
                            ) : (
                                filteredConvs.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => {
                                            setSelectedConv(conv);
                                            setShowMobileList(false);
                                        }}
                                        className={`p-3 cursor-pointer transition-colors ${selectedConv?.id === conv.id ? "bg-emerald-50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {conv.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                                                    <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate">{conv.lastMessage || "No messages"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat */}
                    <div className="flex-1 flex flex-col h-full">
                        {selectedConv ? (
                            <>
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {selectedConv.avatar}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-sm">{selectedConv.name}</h2>
                                        <p className="text-xs text-gray-600">{selectedConv.email}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] ${msg.sender === "user" ? "flex items-start gap-2" : ""}`}>
                                                {msg.sender === "user" && (
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                                                        {selectedConv.avatar}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === "admin"
                                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                                                        : "bg-white text-gray-800"
                                                        }`}>
                                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                                    </div>
                                                    <div className={`text-xs text-gray-500 mt-1 ${msg.sender === "admin" ? "text-right" : ""}`}>
                                                        {msg.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border-2 border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!message.trim()}
                                            className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <MessageCircle className="w-16 h-16 mb-3 opacity-20" />
                                <p className="text-sm">Select a conversation</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden w-full flex flex-col" style={{ height: '100%' }}>
                    {showMobileList ? (
                        <div className="flex flex-col h-full">
                            <div className="p-3 border-b border-gray-100">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {filteredConvs.map((conv) => (
                                    <div
                                        key={conv.id}
                                        onClick={() => {
                                            setSelectedConv(conv);
                                            setShowMobileList(false);
                                        }}
                                        className="p-3 border-b border-gray-100 active:bg-gray-50"
                                    >
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                                {conv.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-0.5">
                                                    <h3 className="font-semibold text-sm truncate">{conv.name}</h3>
                                                    <span className="text-xs text-gray-500">{conv.time}</span>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : selectedConv ? (
                        <div className="flex flex-col h-full">
                            <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                                <button onClick={() => setShowMobileList(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {selectedConv.avatar}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-sm">{selectedConv.name}</h2>
                                    <p className="text-xs text-gray-600">{selectedConv.email}</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] ${msg.sender === "user" ? "flex gap-2" : ""}`}>
                                            {msg.sender === "user" && (
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {selectedConv.avatar}
                                                </div>
                                            )}
                                            <div>
                                                <div className={`rounded-2xl px-3 py-2 ${msg.sender === "admin" ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" : "bg-white"}`}>
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                                <div className={`text-xs text-gray-500 mt-0.5 ${msg.sender === "admin" ? "text-right" : ""}`}>
                                                    {msg.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="px-3 py-2 border-t border-gray-100 bg-white">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                                        placeholder="Type..."
                                        className="flex-1 px-3 py-2 bg-gray-50 border-2 border-emerald-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!message.trim()}
                                        className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default AdminChatInterface;
