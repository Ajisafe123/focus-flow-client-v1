import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const messagesEndRef = useRef(null);
  const [loadingChats, setLoadingChats] = useState(true);

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
        const convs = await fetchConversations(100);
        const mapped = convs.map((c) => ({
          id: c.id,
          name: c.user_name || "User",
          email: c.user_email || "N/A",
          avatar: (c.user_name || "U").slice(0, 2).toUpperCase(),
          lastMessage: c.last_message || "",
          time: c.updated_at,
          unread: 0,
          status: c.status || "active",
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
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;
      try {
        const msgs = await fetchConversationMessages(selectedChat.id);
        setSelectedChat((prev) =>
          prev
            ? {
                ...prev,
                messages: msgs.map((m) => ({
                  id: m.id || m._id,
                  text: m.message_text,
                  sender: m.sender_type,
                  time: new Date(m.created_at || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  status: m.status || "sent",
                })),
              }
            : prev
        );
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    loadMessages();
  }, [selectedChat?.id]);

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    const optimistic = {
      id: Date.now(),
      text: message,
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setSelectedChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
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
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 z-20 bg-white border-b shadow-sm flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setActivePage("dashboard")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <span className="font-semibold text-gray-800">Live Chat</span>
      </div>

      <div className="flex h-full w-full pt-14">
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

        <div className="flex-1 flex flex-col">
          {loadingChats ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Loading conversations...
            </div>
          ) : chats.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              No conversations yet.
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
              onBack={() => setActivePage("dashboard")}
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
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
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
