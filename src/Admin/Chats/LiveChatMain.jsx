import React, { useState, useEffect, useRef } from "react";
import ChatSidebar from "./ChatSidebar";
import AdminChatArea from "./AdminChatArea";
import AdminUserPanel from "./AdminUserPanel";

const LiveChatMain = ({ setActivePage }) => {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed@example.com",
      avatar: "AH",
      lastMessage: "Assalamu alaikum, I need help with...",
      time: "2m ago",
      unread: 2,
      status: "active",
      messages: [
        {
          id: 1,
          text: "Assalamu alaikum wa rahmatullahi wa barakatuh",
          sender: "user",
          time: "10:30 AM",
          status: "read",
        },
        {
          id: 2,
          text: "Wa alaikum assalam wa rahmatullahi wa barakatuh. How may I assist you today?",
          sender: "admin",
          time: "10:31 AM",
          status: "read",
        },
        {
          id: 3,
          text: "I need help understanding a concept",
          sender: "user",
          time: "10:32 AM",
          status: "read",
        },
      ],
    },
    
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [message, setMessage] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat.messages, isTyping]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: selectedChat.messages.length + 1,
        text: message,
        sender: "admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      const updatedChats = chats.map((chat) => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message,
            time: "Just now",
          };
        }
        return chat;
      });

      setChats(updatedChats);
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
      });
      setMessage("");

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const userReply = {
            id: selectedChat.messages.length + 2,
            text: "JazakAllahu khayran for your response!",
            sender: "user",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "read",
          };

          const updatedChatsWithReply = updatedChats.map((chat) => {
            if (chat.id === selectedChat.id) {
              return {
                ...chat,
                messages: [...chat.messages, newMessage, userReply],
                lastMessage: userReply.text,
                time: "Just now",
              };
            }
            return chat;
          });

          setChats(updatedChatsWithReply);
          setSelectedChat({
            ...selectedChat,
            messages: [...selectedChat.messages, newMessage, userReply],
          });
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ChatSidebar
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

      <AdminChatArea
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
      />

      <AdminUserPanel
        selectedChat={selectedChat}
        showUserPanel={showUserPanel}
        setShowUserPanel={setShowUserPanel}
      />

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

export default LiveChatMain;
