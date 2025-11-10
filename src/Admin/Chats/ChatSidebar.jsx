import React from "react";
import { Search, X, MessageSquare, ArrowLeft } from "lucide-react";

const ChatSidebar = ({
  chats,
  selectedChat,
  setSelectedChat,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  setActivePage,
}) => {
  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeChats = chats.filter((c) => c.status === "active").length;
  const waitingChats = chats.filter((c) => c.status === "waiting").length;
  const resolvedChats = chats.filter((c) => c.status === "resolved").length;

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-96 lg:w-80 xl:w-96 bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ${
        isMobileSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActivePage("dashboard")}
              className="p-2 hover:bg-white/20 rounded-lg transition-all flex items-center gap-2 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 backdrop-blur-xl rounded-lg shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Live Chat</h1>
              <p className="text-xs text-emerald-50">Support Center</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-xl rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{activeChats}</p>
              <p className="text-xs text-emerald-50 font-medium">Active</p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{waitingChats}</p>
              <p className="text-xs text-emerald-50 font-medium">Waiting</p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{resolvedChats}</p>
              <p className="text-xs text-emerald-50 font-medium">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "all"
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All ({chats.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "active"
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus("waiting")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "waiting"
                ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Waiting
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setIsMobileSidebarOpen(false);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                selectedChat.id === chat.id
                  ? "bg-emerald-50 border-l-4 border-l-emerald-600"
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {chat.avatar}
                  </div>
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {chat.lastMessage}
                  </p>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      chat.status === "active"
                        ? "bg-green-100 text-green-700"
                        : chat.status === "waiting"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {chat.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
