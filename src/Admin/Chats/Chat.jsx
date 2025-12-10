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
    <div className="flex-1 flex flex-col bg-white h-full min-h-0 overflow-hidden">
      <div className="bg-white border-b border-gray-100 p-4 sm:p-5 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100/80 rounded-full transition-all flex-shrink-0 mr-2 border border-gray-100 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}



            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {selectedChat.avatar || "?"}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base truncate">
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
              className="hidden sm:flex px-4 py-2 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Resolve</span>
            </button>

            <button
              onClick={() => setShowUserPanel(!showUserPanel)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-all"
            >
              <UserCircle className="w-5 h-5 text-gray-600" />
            </button>

            <button className="p-2 hover:bg-gray-50 rounded-lg transition-all">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
        <div className="text-center">
          <div className="inline-block bg-white text-gray-600 px-4 py-2 rounded-full text-xs font-semibold shadow-sm border border-gray-200">
            Today
          </div>
        </div>

        {selectedChat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"
              } animate-fade-in`}
          >
            <div
              className={`max-w-[85%] sm:max-w-md ${msg.sender === "admin" ? "order-2" : "order-1"
                }`}
            >
              {msg.sender === "user" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {selectedChat.avatar || "?"}
                  </div>
                  <span className="text-xs text-gray-600 font-semibold">
                    {selectedChat.name}
                  </span>
                </div>
              )}
              <div
                className={`rounded-2xl px-5 py-3.5 shadow-sm max-w-full ${msg.sender === "admin"
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  }`}
              >
                <p className="text-[15px] leading-relaxed break-words font-medium">
                  {msg.text}
                </p>
              </div>
              <div
                className={`flex items-center gap-1.5 mt-1.5 text-xs ${msg.sender === "admin"
                  ? "justify-end text-gray-500"
                  : "justify-start text-gray-500"
                  }`}
              >
                <span>{msg.time}</span>
                {msg.sender === "admin" &&
                  (msg.status === "read" ? (
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
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
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {selectedChat.avatar}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
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

      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={`p-2.5 rounded-lg transition-all flex-shrink-0 ${showQuickReplies
              ? "bg-emerald-500 text-white"
              : "hover:bg-gray-100 text-gray-600"
              }`}
            title="Quick replies"
          >
            <AlertCircle className="w-5 h-5" />
          </button>

          <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <button className="hidden sm:block p-2.5 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          {isRecording ? (
            <div className="flex-1 flex items-center justify-between px-4 py-3 border border-red-500 rounded-lg bg-red-50 min-w-0">
              <span className="text-red-600 font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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
                <Square className="w-4 h-4" />
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
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm min-w-0"
              rows="1"
            />
          )}

          <button
            onClick={toggleRecording}
            className={`hidden sm:flex p-2.5 rounded-lg transition-all flex-shrink-0 ${isRecording
              ? "bg-red-500 text-white hover:bg-red-600"
              : "hover:bg-gray-100 text-gray-600"
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
            className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chat;
