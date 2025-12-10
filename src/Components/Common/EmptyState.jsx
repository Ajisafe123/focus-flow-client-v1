import React from "react";
import { Search } from "lucide-react";

const EmptyState = ({
    icon: Icon = Search,
    title = "No results found",
    message = "Try adjusting your search or filters to find what you're looking for.",
    actionLabel,
    onAction
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">{message}</p>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
