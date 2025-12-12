import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

const CategoryDropdownCustom = ({
  categories = [],
  selectedCategory = "all",
  onSelectCategory = () => {},
  placeholder = "Select Category",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    categories.find((cat) => cat.id === selectedCategory)?.label ||
    placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-emerald-300 rounded-lg flex items-center justify-between hover:border-emerald-500 transition-all duration-200 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <span className="text-sm">{selectedLabel}</span>
        <ChevronDown
          className={`w-5 h-5 text-emerald-600 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-emerald-300 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {/* All Categories Option */}
            <button
              onClick={() => {
                onSelectCategory("all");
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between group
                ${
                  selectedCategory === "all"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                    : "text-gray-700 hover:bg-emerald-50"
                }
              `}
            >
              <span>All Categories</span>
              {selectedCategory === "all" && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>

            {/* Category Options */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelectCategory(category.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm font-semibold transition-all duration-200 flex items-center justify-between group border-t border-emerald-100
                  ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                      : "text-gray-700 hover:bg-emerald-50"
                  }
                `}
              >
                <span>{category.label}</span>
                {selectedCategory === category.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdownCustom;
