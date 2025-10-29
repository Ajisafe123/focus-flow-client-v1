import React from "react";
import {
  X,
  Send,
  Minimize2,
  Maximize2,
  Paperclip,
  Smile,
  Mic,
  Star,
  Download,
  Archive,
  MoreVertical,
  CheckCheck,
  Check,
  Volume2,
  VolumeX,
  Camera,
  Trash2,
  MessageCircle,
} from "lucide-react";

export const ChatWindow = ({
  isMinimized,
  setIsMinimized,
  setIsOpen,
  adminOnline,
  currentUser,
  messages,
  isTyping,
  isRecording,
  recordingTime,
  setIsRecording,
  message,
  setMessage,
  sendMessage,
  showEmojiPicker,
  setShowEmojiPicker,
  showMenu,
  setShowMenu,
  showRating,
  setShowRating,
  rating,
  setRating,
  soundEnabled,
  setSoundEnabled,
  downloadChat,
  submitRating,
  startVoiceRecording,
  cancelRecording,
  messagesEndRef,
  quickQuestions,
}) => {
  const emojis = [
    "😊",
    "👍",
    "🤲",
    "❤️",
    "🕌",
    "📿",
    "📖",
    "✨",
    "🌙",
    "⭐",
    "🙏",
    "💚",
    "🌟",
    "💫",
    "☪️",
    "🌺",
    "🤗",
    "🙌",
    "💐",
    "🌸",
  ];

  return (
    <div
      className={`bg-white rounded-3xl shadow-2xl flex flex-col transition-all duration-500 overflow-hidden ${
        isMinimized
          ? "w-[90vw] max-w-[320px] sm:max-w-[360px] h-16"
          : "w-[95vw] max-w-[400px] sm:max-w-[440px] h-[85vh] max-h-[650px]"
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        
        <div className="flex items-center gap-3 min-w-0 relative z-10">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          {!isMinimized && (
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base truncate">Islamic Support</h3>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${adminOnline ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-400'}`}>
                  {adminOnline && <span className="absolute w-2 h-2 rounded-full bg-green-400 animate-ping"></span>}
                </div>
                <span className="text-xs text-emerald-50 truncate">
                  {adminOnline ? 'Online now' : 'Offline'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0 relative z-10">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-red-500/30 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-4 py-3 border-b border-emerald-100/50 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md ring-2 ring-white">
                {currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </div>
            
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-emerald-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <MoreVertical className="w-4 h-4 text-emerald-700" />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-emerald-100 py-2 w-52 z-30 animate-scale-in">
                    <button onClick={downloadChat} className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 flex items-center gap-3 transition-colors">
                      <Download className="w-4 h-4 text-emerald-600" /> 
                      <span className="font-medium">Download Chat</span>
                    </button>
                    <button onClick={() => { setShowRating(true); setShowMenu(false); }} className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 flex items-center gap-3 transition-colors">
                      <Star className="w-4 h-4 text-yellow-500" /> 
                      <span className="font-medium">Rate Support</span>
                    </button>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 flex items-center gap-3 transition-colors">
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />} 
                      <span className="font-medium">{soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}</span>
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 flex items-center gap-3 transition-colors">
                      <Archive className="w-4 h-4 text-emerald-600" /> 
                      <span className="font-medium">Archive Chat</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/20 via-white to-teal-50/20">
            {messages.length === 1 && (
              <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-4 border border-emerald-200/50 shadow-sm animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🕌</span>
                  <h4 className="font-bold text-emerald-800 text-sm">Quick Help Topics</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q.query)}
                      className="p-3 bg-white hover:bg-emerald-50 rounded-xl transition-all duration-300 text-center border border-emerald-200/50 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group"
                    >
                      <span className="text-2xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">{q.icon}</span>
                      <span className="text-xs font-semibold text-gray-700 leading-tight block">{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.sender === 'admin' && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                        A
                      </div>
                      <span className="text-xs text-gray-500 font-semibold">Support Team</span>
                    </div>
                  )}
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-br-sm'
                      : 'bg-white border border-emerald-100/50 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${
                    msg.sender === 'user' ? 'justify-end text-gray-400' : 'justify-start text-gray-400'
                  }`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && (
                      msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> :
                      msg.status === 'delivered' ? <CheckCheck className="w-3.5 h-3.5" /> :
                      <Check className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white">
                    A
                  </div>
                  <div className="bg-white border border-emerald-100/50 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showEmojiPicker && (
            <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border-t border-emerald-100/50 p-3 animate-slide-up backdrop-blur-sm">
              <div className="grid grid-cols-10 gap-2">
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessage(message + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-xl hover:bg-white rounded-lg p-2 transition-all duration-200 hover:scale-125 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showRating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-40 rounded-3xl animate-fade-in">
              <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Star className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-lg">Rate Your Experience</h3>
                  <p className="text-sm text-gray-600">How satisfied are you with our support?</p>
                </div>
                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-all duration-300 hover:scale-125 active:scale-95"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} />
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRating(false)}
                    className="flex-1 px-4 py-3 border-2 border-emerald-200 text-emerald-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition-all duration-300 active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRating}
                    disabled={rating === 0}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg active:scale-95"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white border-t border-emerald-100/50 p-3 flex-shrink-0">
            {isRecording ? (
              <div className="flex flex-col gap-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border-2 border-emerald-300 animate-pulse-subtle">
         
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                        <Mic className="w-5 h-5 text-white animate-pulse" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-700">Recording...</p>
                      <p className="text-xs text-emerald-600">{recordingTime}s</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelRecording}
                    className="p-2 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Cancel recording"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-1 h-12">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-emerald-400 to-teal-500 rounded-full"
                      style={{
                        height: '100%',
                        animation: `wave 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                        maxHeight: '100%'
                      }}
                    ></div>
                  ))}
                </div>
                
                <button
                  onClick={() => setIsRecording(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-bold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Stop & Send Recording
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,application/pdf,.doc,.docx';
                    input.onchange = (e) => {
                      console.log('File selected:', e.target.files[0]);
                    };
                    input.click();
                  }}
                  className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group flex-shrink-0"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                </button>
                
                <button 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.capture = 'environment';
                    input.onchange = (e) => {
                      console.log('Image captured:', e.target.files[0]);
                    };
                    input.click();
                  }}
                  className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group hidden sm:flex flex-shrink-0"
                  title="Take photo"
                >
                  <Camera className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                </button>
                
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2.5 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group flex-shrink-0"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                </button>
                
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm transition-all duration-300 min-w-0"
                />
                
                {message.trim() ? (
                  <button
                    onClick={() => sendMessage()}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex-shrink-0"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={startVoiceRecording}
                    className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex-shrink-0"
                    title="Record voice message"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-emerald-100/50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 flex-shrink-0 rounded-b-3xl">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="text-sm">🔒</span>
                <span className="font-semibold">End-to-end encrypted</span>
              </span>
              <span className="hidden sm:inline text-gray-400">•</span>
              <span className="hidden sm:inline">Secure & Private</span>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
