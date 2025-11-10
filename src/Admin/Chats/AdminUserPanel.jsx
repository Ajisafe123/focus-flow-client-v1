import React from "react";
import { User, Settings, Star, Archive, Trash2, X } from "lucide-react";

const AdminUserPanel = ({ selectedChat, showUserPanel, setShowUserPanel }) => {
  return (
    <div
      className={`fixed lg:relative inset-y-0 right-0 z-20 w-full sm:w-80 lg:w-72 xl:w-80 bg-white border-l border-gray-100 overflow-y-auto shadow-xl lg:shadow-none transition-transform duration-300 ${
        showUserPanel ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <h3 className="font-bold text-gray-900 text-lg">User Details</h3>
          <button
            onClick={() => setShowUserPanel(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl mx-auto mb-4 shadow-lg">
            {selectedChat.avatar}
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            {selectedChat.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{selectedChat.email}</p>
          <span
            className={`inline-block text-xs px-4 py-2 rounded-full font-semibold ${
              selectedChat.status === "active"
                ? "bg-green-100 text-green-700"
                : selectedChat.status === "waiting"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {selectedChat.status}
          </span>
        </div>

        <div className="space-y-5">
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              User Details
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900 font-medium">Not provided</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">First contacted:</span>
                <span className="text-gray-900 font-medium">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total messages:</span>
                <span className="text-gray-900 font-medium">
                  {selectedChat.messages.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response time:</span>
                <span className="text-gray-900 font-medium">~2 min</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Quick Actions
            </h4>
            <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 border border-emerald-200">
              <Star className="w-4 h-4" />
              Add to Favorites
            </button>
            <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2 border border-blue-200">
              <Archive className="w-4 h-4" />
              Archive Chat
            </button>
            <button className="w-full px-4 py-3 bg-red-50 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-200">
              <Trash2 className="w-4 h-4" />
              Delete Chat
            </button>
          </div>

          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-3">
              Admin Notes
            </h4>
            <textarea
              placeholder="Add private notes about this user..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows="5"
            />
            <button className="w-full mt-3 px-4 py-2.5 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:shadow-md transition-all">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPanel;
