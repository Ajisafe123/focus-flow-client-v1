import React, { useState, useEffect, useRef } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";

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
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Assalamu alaikum wa rahmatullahi wa barakatuh! Welcome back. How may we assist you today?",
      sender: "admin",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminOnline, setAdminOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const currentUser = {
    name: "Abdullah Rahman",
    email: "abdullah@email.com",
    avatar: "A",
    userId: "12345",
  };

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

  const sendMessage = (text = message) => {
    if (text.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: text,
        sender: "user",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages([...messages, newMessage]);
      setMessage("");
      setShowEmojiPicker(false);

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const adminResponse = {
          id: messages.length + 2,
          text: "JazakAllahu khayran for your message. Let me assist you with that right away.",
          sender: "admin",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "read",
        };
        setMessages((prev) => [...prev, adminResponse]);
      }, 2000);
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
    <div className="fixed bottom-4 right-4 z-50 font-sans">
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
          currentUser={currentUser}
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
        />
      )}
    </div>
  );
}