import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import {
  createConversation,
  fetchConversationMessages,
  sendChatMessage,
  updateMessage,
  deleteMessage,
  fetchProfileMe,
  markMessagesRead,
} from "../Service/apiService";

export default function IslamicUserChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminOnline, setAdminOnline] = useState(true);
  const [chatError, setChatError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const wsRef = useRef(null);
  const [conversationId, setConversationId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen && conversationId) {
      markMessagesRead(conversationId).catch(console.error);
    }
  }, [isOpen, conversationId]);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const quickQuestions = [
    {
      icon: "📿",
      text: "Prayer Times",
      query: "I need information about prayer times",
    },
    {
      icon: "📖",
      text: "Quran Study",
      query: "I want to learn about Quran study",
    },
    { icon: "💰", text: "Zakat", query: "Help me calculate my Zakat" },
    { icon: "🕌", text: "Resources", query: "I need Islamic resources" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const retryTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  const connectSocket = (convId) => {
    if (!convId) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = (import.meta.env.VITE_API_BASE_URL || "https://focus-flow-server-v1.onrender.com")
      .replace(/^http/, "ws") + `/ws/chat/${convId}`;

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("User WS Connected");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const { event: evt, data } = JSON.parse(event.data);
        if (evt === "receive_message") {
          if (isOpenRef.current && (data.sender_type === "admin" || data.sender === "admin")) {
            markMessagesRead(convId).catch(console.error);
          } else if (!isOpenRef.current && (data.sender_type === "admin" || data.sender === "admin")) {
            const notification = document.createElement("div");
            notification.className = "fixed bottom-24 right-4 bg-white border-l-4 border-emerald-500 shadow-xl p-4 rounded-lg z-[60] flex items-center gap-3 animate-slide-up max-w-sm cursor-pointer hover:bg-gray-50 transition-colors";
            notification.style.animation = "slide-up 0.5s ease-out";
            notification.innerHTML = `
                 <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                 </div>
                 <div>
                    <h4 class="font-bold text-gray-800 text-sm">New Message</h4>
                    <p class="text-xs text-gray-600 truncate max-w-[200px]">${data.message_text || "Sent a message"}</p>
                 </div>
              `;
            document.body.appendChild(notification);

            const timer = setTimeout(() => {
              if (document.body.contains(notification)) notification.remove();
            }, 5000);

            notification.onclick = () => {
              setIsOpen(true);
              if (document.body.contains(notification)) notification.remove();
              clearTimeout(timer);
            };
          }

          setMessages((prev) => {
            if (prev.some(m => m.id === data.id)) return prev;

            if (data.tempId && prev.some(m => m.id === Number(data.tempId) || m.id === data.tempId)) {
              return prev.map(m => (m.id === Number(data.tempId) || m.id === data.tempId) ? {
                ...m,
                id: data.id,
                text: data.message_text || data.message || data.text,
                status: data.status || "sent",
                time: new Date(data.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              } : m);
            }

            return [
              ...prev,
              {
                id: data.id || Date.now(),
                text: data.message_text || data.message || data.text,
                sender: data.sender_type || data.sender,
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                status: data.status || "sent",
              },
            ]
          });
        } else if (evt === "messages_read") {
          setMessages(prev => prev.map(m => ({ ...m, status: "read" })));
        } else if (evt === "admin_status") {
          setAdminOnline(data.status === "online");
        }
      } catch (e) {
        console.error("ws parse error", e);
      }
    };

    wsRef.current.onclose = () => {
      console.log("User WS Disconnected, reconnecting in 3s...");
      if (isMountedRef.current) {
        retryTimeoutRef.current = setTimeout(() => connectSocket(convId), 3000);
      }
    };

    wsRef.current.onerror = () => {
      if (wsRef.current) wsRef.current.close();
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        let me = null;
        if (token) {
          try {
            me = await fetchProfileMe(token);
            setCurrentUser({
              name: me.full_name || me.username || "User",
              email: me.email,
              avatar: (me.username || "U").slice(0, 1).toUpperCase(),
              userId: me.user_id,
            });
          } catch (err) {
            console.warn("profile load failed", err);
          }
        }
        const conv = await createConversation({
          userEmail: me?.email,
          userName: me?.username || me?.full_name || "Guest",
        });
        setConversationId(conv.id);
        const msgs = await fetchConversationMessages(conv.id);
        setMessages(
          (msgs || []).map((m) => ({
            id: m.id || m._id,
            text: m.message_text,
            sender: m.sender_type,
            time: new Date(m.created_at || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: m.status || "sent",
          }))
        );
        connectSocket(conv.id);
      } catch (err) {
        console.error("chat init failed", err);
      }
    };
    bootstrap();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [token]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    try {
      const me = currentUser;
      const conv = await createConversation({
        userId: me?.userId,
        userEmail: me?.email,
        userName: me?.name || "Guest",
      });
      const id = conv.id || conv._id;
      if (!id) throw new Error("Failed to create conversation");

      setConversationId(id);
      connectSocket(id);
      return id;
    } catch (err) {
      setChatError(err.message || "Unable to start chat right now.");
      throw err;
    }
  };

  const sendMessage = async (text = message) => {
    if (!text.trim()) return;
    setChatError("");
    setIsSending(true);
    let convId = conversationId;
    try {
      convId = await ensureConversation();
      if (!convId) throw new Error("Conversation initialization failed");
    } catch {
      setIsSending(false);
      return;
    }
    const optimistic = {
      id: Date.now(),
      text,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sending",
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage("");
    setShowEmojiPicker(false);
    try {
      const resp = await sendChatMessage({
        conversationId: convId,
        text,
        senderId: currentUser?.userId,
        senderType: "user",
        tempId: optimistic.id,
      });

      setMessages((prev) =>
        prev.map(m => m.id === optimistic.id ? {
          ...m,
          id: resp.id,
          status: "sent",
          time: new Date(resp.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } : m)
      );
    } catch (err) {
      console.error("send failed", err);
      setChatError("Message not sent. Please try again.");
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    }
    setIsSending(false);
  };

  const onEditMessage = async (msgId, newText) => {
    try {
      await updateMessage(msgId, newText);
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, text: newText } : m))
      );
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const onDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteMessage(msgId);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  const stopAndSendRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      const voiceMessage = {
        id: messages.length + 1,
        text: `Voice message (${recordingTime}s)`,
        sender: "user",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
        type: "voice",
      };
      setMessages([...messages, voiceMessage]);
      setRecordingTime(0);
    }
  };

  const downloadChat = () => {
    alert("Download chat transcript - Feature to be implemented with backend");
    setShowMenu(false);
  };

  const submitRating = () => {
    if (rating > 0) {
      alert(
        `Rating submitted: ${rating} stars - JazakAllahu khayran for your feedback!`
      );
      setShowRating(false);
      setRating(0);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>

      <ChatButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        unreadCount={unreadCount}
      />

      {isOpen && (
        <ChatWindow
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
          setIsOpen={setIsOpen}
          adminOnline={adminOnline}
          currentUser={
            currentUser || { name: "Guest", email: "guest", avatar: "G" }
          }
          messages={messages}
          isTyping={isTyping}
          isRecording={isRecording}
          recordingTime={recordingTime}
          setIsRecording={stopAndSendRecording}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          showEmojiPicker={showEmojiPicker}
          setShowEmojiPicker={setShowEmojiPicker}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          showRating={showRating}
          setShowRating={setShowRating}
          rating={rating}
          setRating={setRating}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          downloadChat={downloadChat}
          submitRating={submitRating}
          startVoiceRecording={startVoiceRecording}
          cancelRecording={cancelRecording}
          messagesEndRef={messagesEndRef}
          quickQuestions={quickQuestions}
          chatError={chatError}
          isSending={isSending}
          onEditMessage={onEditMessage}
          onDeleteMessage={onDeleteMessage}
        />
      )}
    </div>
  );
}