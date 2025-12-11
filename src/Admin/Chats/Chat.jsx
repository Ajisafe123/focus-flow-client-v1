import React, { useState } from "react";
import {
  Menu,
  ArrowLeft,
  Check,
  CheckCheck,
  UserCircle,
  MoreVertical,
  AlertCircle,
  X,
  Paperclip,
  Smile,
  Mic,
  Send,
  Square,
} from "lucide-react";

const Chat = ({
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
  message,
  setMessage,
  sendMessage,
  showQuickReplies,
  setShowQuickReplies,
  isTyping,
  messagesEndRef,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  showUserPanel,
  setShowUserPanel,
  onBack,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);

  const quickReplies = [
    "Assalamu alaikum wa rahmatullahi wa barakatuh",
    "Wa alaikum assalam",
    "JazakAllahu khayran",
    "How may I assist you today?",
    "Please allow me a moment to check",
    "May Allah bless you",
    "Is there anything else I can help with?",
    "Barakallahu feek",
  ];

  const markAsResolved = () => {
    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChat.id) {
        return { ...chat, status: "resolved", unread: 0 };
      }
      return chat;
    });
    setChats(updatedChats);
    setSelectedChat({ ...selectedChat, status: "resolved" });
  };

  // Gracefully handle cases where no chat is selected yet
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    const interval = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
    setRecordingInterval(interval);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordingInterval);
    setRecordingInterval(null);
    setRecordingTime(0);

  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 h-full min-h-0 overflow-hidden">
      {/* Header with glassmorphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-4 sm:p-6 shadow-lg shadow-gray-100/50 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 hover:bg-emerald-50/80 rounded-xl transition-all duration-300 flex-shrink-0 border border-gray-200/50 shadow-sm hover:shadow-md hover:border-emerald-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            {/* Avatar with gradient and shadow */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
                {selectedChat.avatar || "?"}
              </div>
              {selectedChat.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-3 border-white rounded-full shadow-md"></div>
              )}
            </div>

            {/* User info */}
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                {selectedChat.name}
              </h2>
              <p className="text-sm text-gray-600 truncate flex items-center gap-2">
                <span>{selectedChat.email}</span>
                {selectedChat.isOnline && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={markAsResolved}
              className="hidden sm:flex px-5 py-2.5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 items-center gap-2 hover:scale-105"
            >
              <Check className="w-4 h-4" />
              <span>Resolve</span>
            </button>

            <button
              onClick={() => setShowUserPanel(!showUserPanel)}
              className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:shadow-md border border-transparent hover:border-emerald-200"
            >
              <UserCircle className="w-5 h-5 text-gray-600" />
            </button>

            <button className="p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-300">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area with pattern background */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50">
        <div className="text-center">
          <div className="inline-block bg-white/90 backdrop-blur-sm text-gray-600 px-5 py-2.5 rounded-full text-xs font-semibold shadow-md border border-gray-200/50">
            Today
          </div>
        </div>

        {selectedChat.messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className={`max-w-[85%] sm:max-w-lg ${msg.sender === "admin" ? "order-2" : "order-1"
                }`}
            >
              {msg.sender === "user" && (
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/20">
                    {selectedChat.avatar || "?"}
                  </div>
                  <span className="text-xs text-gray-700 font-semibold">
                    {selectedChat.name}
                  </span>
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-4 shadow-md max-w-full transition-all duration-300 hover:shadow-lg ${msg.sender === "admin"
                  ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-br-md shadow-emerald-500/20"
                  : "bg-white text-gray-800 rounded-bl-md border border-gray-100 shadow-gray-200/50"
                  }`}
              >
                <p className="text-[15px] leading-relaxed break-words">
                  {msg.text}
                </p>
              </div>
              <div
                className={`flex items-center gap-2 mt-2 text-xs ${msg.sender === "admin"
                  ? "justify-end text-gray-500"
                  : "justify-start text-gray-500"
                  }`}
              >
                <span className="font-medium">{msg.time}</span>
                {msg.sender === "admin" &&
                  (msg.status === "read" ? (
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                  ) : msg.status === "delivered" ? (
                    <CheckCheck className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Check className="w-4 h-4 text-gray-400" />
                  ))}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-emerald-500/20">
                {selectedChat.avatar}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                <div className="flex gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span
                    className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showQuickReplies && (
        <div className="bg-gray-50 border-t border-gray-200 p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-emerald-600" />
              Quick Replies
            </span>
            <button
              onClick={() => setShowQuickReplies(false)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessage(reply);
                  setShowQuickReplies(false);
                }}
                className="px-3 py-2 bg-white text-gray-700 rounded-lg text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-gray-200"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area with glassmorphism */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/50 p-5 sm:p-6 flex-shrink-0 shadow-2xl shadow-gray-200/20">
        <div className="flex items-end gap-3">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={`p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${showQuickReplies
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
              : "hover:bg-emerald-50 text-gray-600 border border-gray-200 hover:border-emerald-200"
              }`}
            title="Quick replies"
          >
            <AlertCircle className="w-5 h-5" />
          </button>

          <button className="p-3 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex-shrink-0 border border-gray-200 hover:border-emerald-200">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <button className="hidden sm:block p-3 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex-shrink-0 border border-gray-200 hover:border-emerald-200">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-5 py-3.5 border-2 border-red-500 rounded-xl bg-red-50 min-w-0">
              <span className="text-red-600 font-semibold text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                Recording
              </span>
              <span className="text-red-600 font-mono text-sm">
                {formatTime(recordingTime)}
              </span>
              <button
                onClick={toggleRecording}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                title="Stop Recording"
              >
                <Square className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" &&
                !e.shiftKey &&
                (e.preventDefault(), sendMessage())
              }
              placeholder="Type your message..."
              className="flex-1 px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm min-w-0 transition-all duration-300 hover:border-emerald-200"
              rows="1"
            />
          )}

          <button
            onClick={toggleRecording}
            className={`hidden sm:flex p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${isRecording
              ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
              : "hover:bg-emerald-50 text-gray-600 border border-gray-200 hover:border-emerald-200"
              }`}
          >
            {isRecording ? (
              <Square className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={sendMessage}
            disabled={!message.trim() || isRecording}
            className="p-3.5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 disabled:shadow-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-105 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center font-medium">
          Press <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Enter</kbd> to send • <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default Chat;
