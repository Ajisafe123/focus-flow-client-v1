import React, { useMemo } from "react";
import { Search, X, MessageSquare, ArrowLeft } from "lucide-react";

const Sidebar = ({
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
  const uniqueChats = useMemo(() => {
    const seen = new Set();
    return chats.filter(chat => {
      const id = String(chat.id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [chats]);

  const filteredChats = uniqueChats.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || chat.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeChats = uniqueChats.filter((c) => c.status === "active").length;
  const waitingChats = uniqueChats.filter((c) => c.status === "waiting").length;
  const resolvedChats = uniqueChats.filter((c) => c.status === "resolved").length;

  return (
    <div
      className={`fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-96 lg:w-80 xl:w-96 bg-white border-r border-gray-100 flex flex-col shadow-xl lg:shadow-none transition-transform duration-300 ${isMobileSidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
        }`}
    >
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-bold text-xl flex items-center gap-2">
            <button
              onClick={() => setActivePage("dashboard")}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mr-1 border border-transparent hover:border-gray-200"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Messages</span>
          </h2>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
          />
        </div>

        <div className="flex gap-1.5 p-1 bg-gray-50 rounded-xl border border-gray-100">
          {['all', 'active', 'waiting', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${filterStatus === status
                ? "bg-white text-emerald-600 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-10" />
            <p className="text-sm font-medium">No results found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setIsMobileSidebarOpen(false);
              }}
              className={`px-4 py-3.5 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50/50 group relative ${selectedChat?.id === chat.id
                ? "bg-emerald-50/60"
                : ""
                }`}
            >
              {selectedChat?.id === chat.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
              )}

              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105 ${selectedChat?.id === chat.id
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500"
                    }`}>
                    {chat.avatar}
                  </div>
                  {chat.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                  {chat.unread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className={`font-semibold text-[15px] truncate ${selectedChat?.id === chat.id ? "text-gray-900" : "text-gray-700"}`}>
                      {chat.name}
                    </h3>
                    <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${selectedChat?.id === chat.id ? "text-emerald-600 font-medium" : "text-gray-500"}`}>
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
