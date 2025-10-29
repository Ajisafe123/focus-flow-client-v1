import React from "react";
import {
  Menu,
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
} from "lucide-react";

const AdminChatArea = ({
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
}) => {
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

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-emerald-50/20 via-white to-teal-50/20">
      <div className="bg-white border-b border-emerald-100 p-3 sm:p-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-emerald-50 rounded-xl transition-all flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-emerald-600" />
            </button>

            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white flex-shrink-0">
              {selectedChat.avatar}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                {selectedChat.name}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {selectedChat.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={markAsResolved}
              className="hidden sm:flex px-3 sm:px-4 py-2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Mark Resolved</span>
            </button>

            <button
              onClick={() => setShowUserPanel(!showUserPanel)}
              className="p-2 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <UserCircle className="w-5 h-5 text-emerald-900" />
            </button>

            <button className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="text-center">
          <div className="inline-block bg-emerald-100 text-emerald-900 px-4 py-2 rounded-full text-xs font-semibold shadow-sm">
            Today
          </div>
        </div>

        {selectedChat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "admin" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`max-w-[85%] sm:max-w-md ${
                msg.sender === "admin" ? "order-2" : "order-1"
              }`}
            >
              {msg.sender === "user" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                    {selectedChat.avatar}
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">
                    {selectedChat.name}
                  </span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  msg.sender === "admin"
                    ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  text-white rounded-br-sm"
                    : "bg-white border border-emerald-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {msg.text}
                </p>
              </div>
              <div
                className={`flex items-center gap-1.5 mt-1.5 text-xs ${
                  msg.sender === "admin"
                    ? "justify-end text-gray-400"
                    : "justify-start text-gray-400"
                }`}
              >
                <span>{msg.time}</span>
                {msg.sender === "admin" &&
                  (msg.status === "read" ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-900" />
                  ) : msg.status === "delivered" ? (
                    <CheckCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  ))}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                {selectedChat.avatar}
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-emerald-800 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-emerald-800 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-emerald-800 rounded-full animate-bounce"
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
        <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-t border-emerald-100 p-3 sm:p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Quick Replies
            </span>
            <button
              onClick={() => setShowQuickReplies(false)}
              className="p-1 hover:bg-white rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-gray-400" />
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
                className="px-3 py-2 bg-white text-emerald-800 rounded-xl text-xs font-medium hover:bg-emerald-100 transition-all duration-300 shadow-sm hover:shadow-md border border-emerald-200"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-t border-emerald-100 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={`p-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
              showQuickReplies
                ? "bg-emerald-600 text-white"
                : "hover:bg-emerald-50 text-emerald-700"
            }`}
            title="Quick replies"
          >
            <AlertCircle className="w-5 h-5" />
          </button>

          <button className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex-shrink-0">
            <Paperclip className="w-5 h-5 text-emerald-700" />
          </button>

          <button className="hidden sm:block p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex-shrink-0">
            <Smile className="w-5 h-5 text-emerald-700" />
          </button>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), sendMessage())
            }
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none text-sm min-w-0"
            rows="1"
          />

          <button className="hidden sm:block p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 flex-shrink-0">
            <Mic className="w-5 h-5 text-emerald-700" />
          </button>

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-3 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  text-white rounded-xl hover:from-emerald-800 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default AdminChatArea;
