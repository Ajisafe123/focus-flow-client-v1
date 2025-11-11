import React from "react";
import { MessageCircle } from "lucide-react";

export const ChatButton = ({ isOpen, setIsOpen, unreadCount }) => {
  if (isOpen) return null;

  return (
    <div className="relative w-max mb-20 lg:mb-0 lg:mr-8 z-30">
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-110 flex items-center justify-center group"
        aria-label="Open chat"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></span>

        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10 drop-shadow-lg" />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
      </button>

      <div className="hidden lg:block absolute bottom-20 right-0 mb-2 animate-float z-30">
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-80 border-l-4 border-emerald-600 relative">
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-l-4 border-b-4 border-emerald-600 transform rotate-45"></div>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700 mb-1 flex items-center gap-2">
                <span className="text-lg">💬</span>
                Assalamu Alaikum!
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Need help with Islamic resources, prayer times, or Zakat
                calculations? Our support team is available 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
