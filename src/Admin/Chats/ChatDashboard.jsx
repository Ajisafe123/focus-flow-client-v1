import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, MessageCircle, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import UsersDetails from "./UsersDetails";
import { API_BASE_URL } from "../../Components/Service/apiService";

const ChatDashboard = ({ setActivePage }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // Default to open on mobile if no chat
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchConversations = async (limit = 50) => {
    const res = await fetch(`${API_BASE_URL}/api/conversations?limit=${limit}`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return res.json();
  };

  const fetchConversationMessages = async (conversationId) => {
    const res = await fetch(
      `${API_BASE_URL}/api/messages/${conversationId}/messages`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error("Failed to fetch messages");
    return res.json();
  };

  const sendConversationMessage = async ({
    conversationId,
    text,
    senderId = null,
    senderType = "admin",
  }) => {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        conversationId,
        text,
        senderId,
        senderType,
        messageType: "text",
      }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  };

  const markMessagesRead = async (conversationId) => {
    try {
      await fetch(`${API_BASE_URL}/api/messages/${conversationId}/read`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch (err) {
      console.error("Failed to mark messages read", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages, isTyping]);

  useEffect(() => {
    const load = async () => {
      setLoadingChats(true);
      try {
        const convs = await fetchConversations();
        const validConvs = [];
        const seenEmails = new Set();

        for (const c of convs) {
          // Use email as unique identifier for user
          // If no email, fallback to ID but this risks duplicates if same user has multiple chats
          const key = c.user_email ? c.user_email.toLowerCase() : String(c.id);

          if (!seenEmails.has(key)) {
            seenEmails.add(key);
            validConvs.push(c);
          }
        }

        const mapped = validConvs.map((c) => ({
          id: c.id,
          name: c.user_name || "User",
          email: c.user_email || "N/A",
          avatar: (c.user_name || "U").slice(0, 2).toUpperCase(),
          lastMessage: c.last_message || "",
          time: c.updated_at,
          unread: 0,
          status: c.status || "active",
          isOnline: false,
          messages: [],
        }));
        setChats(mapped);
        if (mapped.length > 0) {
          setSelectedChat(mapped[0]);
        }
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setLoadingChats(false);
      }
    };
    load();

    // WebSocket Connection
    const wsUrl = (API_BASE_URL || "http://localhost:8000").replace(/^http/, "ws") + "/ws/chat/admin";
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      console.log("Admin WS Connected");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      console.log("Admin WS Disconnected");
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);



  const chatsRef = useRef(chats);
  const selectedChatRef = useRef(selectedChat);

  useEffect(() => {
    chatsRef.current = chats;
    selectedChatRef.current = selectedChat;
  }, [chats, selectedChat]);

  const handleWebSocketMessage = (message) => {
    const currentChats = chatsRef.current;
    const currentSelected = selectedChatRef.current;
    const { event, data } = message;

    if (event === "receive_message") {
      const { conversation_id, sender_type, tempId, id } = data;

      const chatIndex = currentChats.findIndex((c) => String(c.id) === String(conversation_id));

      if (chatIndex !== -1) {
        const updatedChat = {
          ...currentChats[chatIndex],
          lastMessage: data.message_text || (data.file_url ? "Sent a file" : ""),
          time: new Date(data.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: (currentSelected?.id && String(currentSelected.id) !== String(conversation_id) && sender_type === "user")
            ? (currentChats[chatIndex].unread || 0) + 1
            : currentChats[chatIndex].unread,
        };

        const newChats = [
          updatedChat,
          ...currentChats.filter((c) => String(c.id) !== String(conversation_id)),
        ];

        setChats(newChats);

        if (currentSelected?.id && String(currentSelected.id) === String(conversation_id)) {
          setSelectedChat((prev) => {
            if (prev.messages.some(m => String(m.id) === String(id))) return prev;

            if (tempId) {
              const existingTemp = prev.messages.find(m => String(m.id) === String(tempId));
              if (existingTemp) {
                return {
                  ...prev,
                  messages: prev.messages.map(m => String(m.id) === String(tempId) ? {
                    ...m,
                    id: id,
                    status: "sent"
                  } : m)
                };
              }
            }

            const newMsg = {
              id: id,
              text: data.message_text,
              sender: sender_type,
              time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: data.status,
            };

            return { ...prev, messages: [...prev.messages, newMsg] };
          });

          if (sender_type === "user") {
            markMessagesRead(conversation_id);
          }
        }
      } else {
        const exists = currentChats.some(c => String(c.id) === String(conversation_id));
        if (!exists) {
          const refreshList = async () => {
            try {
              const convs = await fetchConversations(50);
              setChats(prev => {
                // Create a map of existing chats by Email (or ID if no email)
                const chatMap = new Map();
                prev.forEach(c => {
                  const key = c.email ? c.email.toLowerCase() : String(c.id);
                  chatMap.set(key, c);
                });

                // Merge fetched conversations
                // Since fetchConversations returns latest sorted, these should overwrite old entries
                for (const c of convs) {
                  const key = c.user_email ? c.user_email.toLowerCase() : String(c.id);
                  const isCurrentChat = String(c.id) === String(conversation_id);

                  const newChatObj = {
                    id: c.id,
                    name: c.user_name || "User",
                    email: c.user_email || "N/A",
                    avatar: (c.user_name || "U").slice(0, 2).toUpperCase(),
                    lastMessage: c.last_message || "",
                    time: c.updated_at,
                    unread: isCurrentChat ? (chatMap.get(key)?.unread || 0) + 1 : (chatMap.get(key)?.unread || 0),
                    status: c.status || "active",
                    isOnline: false, // Status updates will handle this
                    messages: chatMap.get(key)?.messages || [],
                  };

                  // Always update/overwrite with latest from API
                  chatMap.set(key, newChatObj);
                }

                // Return values sorted by time (newest first)
                return Array.from(chatMap.values()).sort((a, b) => {
                  return new Date(b.time) - new Date(a.time);
                });
              });
            } catch (err) { console.error("Refresh failed", err); }
          };
          refreshList();
        }
      }
    } else if (event === "messages_read") {
      const { conversation_id } = data;

      if (currentSelected?.id && String(currentSelected.id) === String(conversation_id)) {
        setSelectedChat(prev => ({
          ...prev,
          messages: prev.messages.map(m => ({ ...m, status: "read" }))
        }));
      }
    } else if (event === "user_status") {
      const { conversation_id, status } = data;
      setChats((prev) =>
        prev.map(c => String(c.id) === String(conversation_id) ? { ...c, isOnline: status === "online" } : c)
      );
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat?.id) return;
      try {
        const msgs = await fetchConversationMessages(selectedChat.id);
        const formattedMsgs = msgs.map((m) => ({
          id: m.id || m._id,
          text: m.message_text,
          sender: m.sender_type,
          time: new Date(m.created_at || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: m.status || "sent",
        }));

        setSelectedChat((prev) => ({
          ...prev,
          messages: formattedMsgs,
        }));

        markMessagesRead(selectedChat.id);

      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    loadMessages();
  }, [selectedChat?.id]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    const tempId = Date.now();
    const optimistic = {
      id: tempId,
      text: message,
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setSelectedChat((prev) =>
      prev ? { ...prev, messages: [...(prev.messages || []), optimistic] } : prev
    );
    setMessage("");

    sendConversationMessage({
      conversationId: selectedChat.id,
      text: message,
      senderId: null,
      senderType: "admin",
    }).catch((err) => console.error("send failed", err));
  };

  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden relative font-sans">



      <div className="flex h-full w-full pt-0 lg:pt-0">
        <Sidebar
          chats={chats}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          setActivePage={setActivePage}
        />

        <div className="flex-1 flex flex-col relative bg-white">
          <div className="hidden lg:flex absolute top-4 right-4 z-10 items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            <span className="text-xs font-semibold text-gray-600">{isConnected ? 'System Online' : 'disconnected'}</span>
          </div>

          {loadingChats ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <p className="font-medium">Loading conversations...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
              <MessageCircle className="w-16 h-16 opacity-20 mb-4" />
              <p>No conversations yet.</p>
            </div>
          ) : (
            <Chat
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
              setChats={setChats}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              showQuickReplies={showQuickReplies}
              setShowQuickReplies={setShowQuickReplies}
              isTyping={isTyping}
              messagesEndRef={messagesEndRef}
              isMobileSidebarOpen={isMobileSidebarOpen}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              showUserPanel={showUserPanel}
              setShowUserPanel={setShowUserPanel}
              onBack={() => {
                if (isMobileSidebarOpen || window.innerWidth < 1024) {
                  setSelectedChat(null);
                  setIsMobileSidebarOpen(true);
                } else {
                  setActivePage("dashboard");
                }
              }}
            />
          )}
        </div>

        <UsersDetails
          selectedChat={selectedChat}
          showUserPanel={showUserPanel}
          setShowUserPanel={setShowUserPanel}
        />
      </div>

      {(isMobileSidebarOpen || showUserPanel) && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => {
            setIsMobileSidebarOpen(false);
            setShowUserPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatDashboard;
