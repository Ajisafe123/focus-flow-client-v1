import React from "react";
import { Search } from "lucide-react";

/**
 * Shared Page Header Component
 * @param {Object} props
 * @param {string} props.title - Main title of the page
 * @param {string} props.subtitle - Subtitle text
 * @param {ElementType} props.icon - Lucide icon component
 * @param {boolean} props.showSearch - Whether to show the search bar
 * @param {string} [props.searchTerm] - Current search value
 * @param {function} [props.onSearchChange] - Search change handler
 * @param {string} [props.placeholder] - Search placeholder
 */
const PageHeader = ({
    title,
    subtitle,
    icon: Icon,
    showSearch = false,
    searchTerm = "",
    onSearchChange,
    placeholder = "Search...",
    children
}) => {
    return (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white py-12 sm:py-16 shadow-xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30 shadow-inner flex-shrink-0">
                        {Icon && <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                            {title}
                        </h1>
                        <p className="text-emerald-50 text-base sm:text-lg mt-1 font-medium opacity-90">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {showSearch && (
                    <div className="relative mt-6 sm:mt-8 max-w-3xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5 sm:w-6 sm:h-6" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={onSearchChange}
                            className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-xl border-2 border-emerald-400/30 focus:border-white text-gray-900 placeholder-gray-500 shadow-lg transition-all bg-white text-base focus:ring-4 focus:ring-emerald-500/20 outline-none"
                        />
                    </div>
                )}

                {children}
            </div>
        </div>
    );
};

export default PageHeader;
