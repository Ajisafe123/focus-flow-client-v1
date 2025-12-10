import React from "react";
import {
  Hash,
  Tag,
  BookOpen,
  Clipboard,
  Lightbulb,
  Star,
  ListPlus,
  ChevronDown,
} from "lucide-react";

const CategorySelectComponent = ({
  value,
  onChange,
  label = "Category",
  currentCategories,
  hasCategories,
  isLoading,
  setShowCategoryModal,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center justify-between">
      <span className="flex items-center gap-1">
        <Tag className="w-4 h-4 text-emerald-700" /> {label}
      </span>
      <button
        type="button"
        onClick={() => setShowCategoryModal(true)}
        className="flex items-center text-xs text-green-600 hover:text-green-800 font-medium transition-colors"
      >
        <ListPlus className="w-3 h-3 mr-1" /> Create
      </button>
    </label>
    {!hasCategories ? (
      <div className="p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs font-medium">
        No categories available.
      </div>
    ) : (
      <select
        required
        disabled={!hasCategories || isLoading}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white cursor-pointer disabled:bg-gray-200"
      >
        <option value="" disabled>
          Select a Category
        </option>
        {currentCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label || cat.title}
          </option>
        ))}
      </select>
    )}
  </div>
);

const HadithManualEntryTab = ({
  formData,
  handleChange,
  currentCategories,
  hasCategories,
  isLoading,
  setShowCategoryModal,
  showAdditional,
  setShowAdditional,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Hash className="w-4 h-4 text-emerald-700" /> Title / Subject
          </label>
          <input
            type="text"
            required
            disabled={!hasCategories || isLoading}
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-200"
            placeholder="The Excellence of Sincerity"
          />
        </div>
        <CategorySelectComponent
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          currentCategories={currentCategories}
          hasCategories={hasCategories}
          isLoading={isLoading}
          setShowCategoryModal={setShowCategoryModal}
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <BookOpen className="w-4 h-4 text-teal-700" /> Arabic Text
        </label>
        <textarea
          dir="rtl"
          rows="3"
          disabled={!hasCategories || isLoading}
          value={formData.arabic || ""}
          onChange={(e) => handleChange("arabic", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg leading-relaxed font-arabic text-right disabled:bg-gray-200"
          placeholder="إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى"
        />
      </div>

      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
          <Lightbulb className="w-4 h-4 text-teal-700" /> English Translation
        </label>
        <textarea
          required
          rows="3"
          disabled={!hasCategories || isLoading}
          value={formData.translation || ""}
          onChange={(e) => handleChange("translation", e.target.value)}
          className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:bg-gray-200"
          placeholder="Actions are but by intentions, and verily, every man shall have but that which he intended."
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowAdditional(!showAdditional)}
          className="w-full p-2 text-left flex items-center justify-between text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          disabled={isLoading}
        >
          Additional Details (Narrator, Source, Reference)
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              showAdditional ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {showAdditional && (
          <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Narrator
                </label>
                <input
                  type="text"
                  disabled={!hasCategories || isLoading}
                  value={formData.narrator || ""}
                  onChange={(e) => handleChange("narrator", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                  placeholder="Umar ibn al-Khattāb"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Source Book
                </label>
                <input
                  type="text"
                  disabled={!hasCategories || isLoading}
                  value={formData.source || ""}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                  placeholder="Sahih al-Bukhari & Muslim"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Reference / Hadith Number
              </label>
              <input
                type="text"
                disabled={!hasCategories || isLoading}
                value={formData.reference || ""}
                onChange={(e) => handleChange("reference", e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                placeholder="Bukhari: 1, Muslim: 1907"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-300 shadow-sm">
        <input
          type="checkbox"
          id="featured"
          disabled={!hasCategories || isLoading}
          checked={formData.featured || false}
          onChange={(e) => handleChange("featured", e.target.checked)}
          className="w-4 h-4 text-amber-500 rounded-sm focus:ring-amber-400 border-amber-300 disabled:opacity-50"
        />
        <label
          htmlFor="featured"
          className="flex items-center gap-1 text-gray-900 font-medium cursor-pointer text-sm"
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Mark as **Featured** Hadith
        </label>
      </div>
    </div>
  );
};

export default HadithManualEntryTab;
