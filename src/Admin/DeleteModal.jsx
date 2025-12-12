import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({
  show,
  onClose,
  onDelete,
  itemTitle,
  itemType = "Item",
  warningText = null,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Delete {itemType}</h3>
          </div>
          <p className="text-red-50 text-sm">
            This action cannot be undone
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <p className="text-gray-700 text-sm mb-2">
              Are you sure you want to delete:
            </p>
            <p className="text-gray-900 font-semibold text-base break-words">
              "{itemTitle}"
            </p>
          </div>

          {warningText && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 font-semibold text-sm">
                {warningText}
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
