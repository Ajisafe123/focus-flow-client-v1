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
      className={`fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-96 lg:w-80 xl:w-96 bg-white border-r border-emerald-100 flex flex-col shadow-2xl lg:shadow-lg transition-transform duration-300 ${
        isMobileSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-4 sm:p-5 border-b border-emerald-100 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setActivePage("dashboard")}
              className="p-2 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-semibold">Back</span>
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                Live Chat
              </h1>
              <p className="text-xs text-emerald-50">Support Center</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-2 text-center">
              <p className="text-2xl font-bold text-white">{activeChats}</p>
              <p className="text-xs text-emerald-50">Active</p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-2 text-center">
              <p className="text-2xl font-bold text-white">{waitingChats}</p>
              <p className="text-xs text-emerald-50">Waiting</p>
            </div>
            <div className="bg-white/20 backdrop-blur-xl rounded-xl p-2 text-center">
              <p className="text-2xl font-bold text-white">{resolvedChats}</p>
              <p className="text-xs text-emerald-50">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 border-b border-emerald-100 space-y-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm transition-all"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              filterStatus === "all"
                ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  text-white shadow-lg"
                : "bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            All ({chats.length})
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              filterStatus === "active"
                ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  text-white shadow-lg"
                : "bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus("waiting")}
            className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              filterStatus === "waiting"
                ? "bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  text-white shadow-lg"
                : "bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            Waiting
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="w-16 h-16 text-emerald-200 mb-4" />
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
              className={`p-4 border-b border-emerald-50 cursor-pointer transition-all duration-300 ${
                selectedChat.id === chat.id
                  ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-l-emerald-700"
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900  flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
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
                    <h3 className="font-bold text-gray-800 text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mb-2">
                    {chat.lastMessage}
                  </p>
                  <div className="flex items-center gap-2">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
