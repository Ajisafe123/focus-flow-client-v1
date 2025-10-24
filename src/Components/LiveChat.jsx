import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Paperclip, Smile, Phone, Video, Image as ImageIcon, FileText, Mic, Settings, Star, Download, Archive, MoreVertical, CheckCheck, Check, Volume2, VolumeX, Camera } from 'lucide-react';

export default function IslamicUserChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Assalamu alaikum wa rahmatullahi wa barakatuh! Welcome back. How may we assist you today?',
      sender: 'admin',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminOnline, setAdminOnline] = useState(true);
  const messagesEndRef = useRef(null);

  const currentUser = {
    name: 'Abdullah Rahman',
    email: 'abdullah@email.com',
    avatar: 'A',
    userId: '12345'
  };

  const quickQuestions = [
    { icon: '📿', text: 'Prayer Times', query: 'I need information about prayer times' },
    { icon: '📖', text: 'Quran Study', query: 'I want to learn about Quran study' },
    { icon: '💰', text: 'Zakat', query: 'Help me calculate my Zakat' },
    { icon: '🕌', text: 'Resources', query: 'I need Islamic resources' }
  ];

  const emojis = ['😊', '👍', '🤲', '❤️', '🕌', '📿', '📖', '✨', '🌙', '⭐', '🙏', '💚'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = (text = message) => {
    if (text.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: text,
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };

      setMessages([...messages, newMessage]);
      setMessage('');
      setShowEmojiPicker(false);

      if (soundEnabled) {
      
      }

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const adminResponse = {
          id: messages.length + 2,
          text: 'JazakAllahu khayran for your message. Let me assist you with that.',
          sender: 'admin',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        };
        setMessages(prev => [...prev, adminResponse]);
      }, 2000);
    }
  };

  const handleVoiceCall = () => {
    alert('Voice call feature - Backend required');
  };

  const handleVideoCall = () => {
    alert('Video call feature - Backend required');
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceMessage = {
        id: messages.length + 1,
        text: '🎤 Voice message (0:15)',
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'voice'
      };
      setMessages([...messages, voiceMessage]);
    }, 3000);
  };

  const handleFileUpload = (type) => {
    const fileMessage = {
      id: messages.length + 1,
      text: type === 'image' ? '📷 Image.jpg' : '📎 Document.pdf',
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: type
    };
    setMessages([...messages, fileMessage]);
  };

  const downloadChat = () => {
    alert('Download chat transcript - Feature to be implemented');
  };

  const submitRating = () => {
    alert(`Rating submitted: ${rating} stars - Thank you!`);
    setShowRating(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full shadow-2xl hover:shadow-emerald-400/50 transition-all hover:scale-110 flex items-center justify-center group"
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <div className="hidden lg:block absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-3 w-64 border-l-4 border-emerald-600 mb-2">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-emerald-600">💬 Assalamu Alaikum!</span><br />
              Have questions? Chat with us 24/7
            </p>
          </div>
        </div>
      )}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl flex flex-col transition-all ${
          isMinimized 
            ? 'w-72 sm:w-80 h-14' 
            : 'w-[calc(100vw-2rem)] sm:w-96 lg:w-[420px] h-[calc(100vh-2rem)] sm:h-[500px] lg:h-[580px] max-h-[90vh]'
        }`}>
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-3 sm:p-4 rounded-t-2xl flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              {!isMinimized && (
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm truncate">Islamic Support</h3>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${adminOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-[10px] sm:text-xs text-emerald-50 truncate">
                      {adminOnline ? 'Online now' : 'Offline'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {!isMinimized && (
                <>
                  <button
                    onClick={handleVoiceCall}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Voice Call"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          {!isMinimized && (
            <>
              <div className="bg-emerald-50 px-3 sm:px-4 py-2 border-b border-emerald-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {currentUser.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-800 truncate">{currentUser.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-emerald-700" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 w-40 z-10">
                      <button onClick={downloadChat} className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 flex items-center gap-2">
                        <Download className="w-3 h-3" /> Download Chat
                      </button>
                      <button onClick={() => setShowRating(true)} className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 flex items-center gap-2">
                        <Star className="w-3 h-3" /> Rate Support
                      </button>
                      <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 flex items-center gap-2">
                        {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />} 
                        {soundEnabled ? 'Mute' : 'Unmute'}
                      </button>
                      <button className="w-full px-3 py-2 text-left text-xs hover:bg-emerald-50 flex items-center gap-2">
                        <Archive className="w-3 h-3" /> Archive Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-emerald-50/30 to-white">
                
                {messages.length === 1 && (
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-3 sm:p-4 border border-emerald-200">
                    <h4 className="font-bold text-emerald-800 text-xs sm:text-sm mb-2">🕌 Quick Help</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(q.query)}
                          className="p-2 bg-white hover:bg-emerald-50 rounded-lg transition-colors text-center border border-emerald-200"
                        >
                          <span className="text-base sm:text-lg block mb-1">{q.icon}</span>
                          <span className="text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">{q.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      {msg.sender === 'admin' && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                            A
                          </div>
                          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Support</span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                          : 'bg-white border border-emerald-100 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-xs sm:text-sm break-words">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs ${
                        msg.sender === 'user' ? 'justify-end text-gray-400' : 'justify-start text-gray-400'
                      }`}>
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && (
                          msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-emerald-500" /> :
                          msg.status === 'delivered' ? <CheckCheck className="w-3 h-3" /> :
                          <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                        A
                      </div>
                      <div className="bg-white border border-emerald-100 rounded-2xl rounded-bl-none px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              {showEmojiPicker && (
                <div className="bg-white border-t border-emerald-100 p-2 sm:p-3">
                  <div className="grid grid-cols-6 gap-2">
                    {emojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setMessage(message + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-xl sm:text-2xl hover:bg-emerald-50 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {showRating && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10 rounded-2xl">
                  <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-sm">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">Rate Your Experience</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4">How satisfied are you with our support?</p>
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                        >
                          <Star className={`w-6 h-6 sm:w-8 sm:h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowRating(false)}
                        className="flex-1 px-3 sm:px-4 py-2 border border-emerald-200 text-emerald-700 rounded-lg text-xs sm:text-sm hover:bg-emerald-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={submitRating}
                        disabled={rating === 0}
                        className="flex-1 px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs sm:text-sm hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white border-t border-emerald-100 p-2 sm:p-3 flex-shrink-0">
                {isRecording ? (
                  <div className="flex items-center justify-between bg-red-50 rounded-xl p-3 border border-red-200">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-red-700 font-medium">Recording...</span>
                    </div>
                    <button
                      onClick={() => setIsRecording(false)}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm hover:bg-red-700"
                    >
                      Stop & Send
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*,application/pdf,.doc,.docx';
                          input.click();
                        }}
                        className="p-1.5 sm:p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.capture = 'environment';
                        input.click();
                      }}
                      className="p-1.5 sm:p-2 hover:bg-emerald-50 rounded-lg transition-colors hidden sm:block"
                    >
                      <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </button>
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 sm:p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                      placeholder="Type message..."
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs sm:text-sm"
                    />
                    {message.trim() ? (
                      <button
                        onClick={() => sendMessage()}
                        className="p-2 sm:p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                      >
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={startVoiceRecording}
                        className="p-2 sm:p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
                      >
                        <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-t border-emerald-100 bg-emerald-50/50 flex-shrink-0">
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-gray-500">
                  <span>🔒 Encrypted</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">Secure & Private</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}