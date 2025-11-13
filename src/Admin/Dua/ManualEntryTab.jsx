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
            {cat.name}
          </option>
        ))}
      </select>
    )}
  </div>
);

const ManualEntryTab = ({
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
            <Hash className="w-4 h-4 text-emerald-700" /> Title (English)
          </label>
          <input
            type="text"
            required
            disabled={!hasCategories || isLoading}
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:bg-gray-200"
            placeholder="Ayat al-Kursi"
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
          required
          dir="rtl"
          rows="2"
          disabled={!hasCategories || isLoading}
          value={formData.arabic || ""}
          onChange={(e) => handleChange("arabic", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 text-lg leading-relaxed font-arabic text-right disabled:bg-gray-200"
          placeholder="ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ..."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Clipboard className="w-4 h-4 text-teal-700" /> Transliteration
          </label>
          <textarea
            rows="1"
            disabled={!hasCategories || isLoading}
            value={formData.transliteration || ""}
            onChange={(e) => handleChange("transliteration", e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 italic disabled:bg-gray-200"
            placeholder="Allāhu lā ilāha illā huw..."
          />
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Lightbulb className="w-4 h-4 text-teal-700" /> English Translation
          </label>
          <textarea
            required
            rows="1"
            disabled={!hasCategories || isLoading}
            value={formData.translation || ""}
            onChange={(e) => handleChange("translation", e.target.value)}
            className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:bg-gray-200"
            placeholder="Allah - there is no deity except Him..."
          />
        </div>
      </div>
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setShowAdditional(!showAdditional)}
          className="w-full p-2 text-left flex items-center justify-between text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          disabled={isLoading}
        >
          Additional Details (Optional)
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              showAdditional ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        {showAdditional && (
          <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 transition-all duration-300 ease-in-out">
            <h5 className="text-sm font-bold text-blue-800 border-b border-blue-200 pb-2">
              Segment Highlighting Data (JSON String)
            </h5>

            <label className="block">
              <span className="text-gray-700 font-medium text-sm">
                Arabic Segments JSON
              </span>
              <textarea
                rows="3"
                disabled={!hasCategories || isLoading}
                value={formData.arabic_segments_json || ""}
                onChange={(e) =>
                  handleChange("arabic_segments_json", e.target.value)
                }
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                placeholder='[{"text": "الْحَمْدُ", "start_time": 0.0, "end_time": 1.5}, ...]'
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium text-sm">
                Transliteration Segments JSON
              </span>
              <textarea
                rows="3"
                disabled={!hasCategories || isLoading}
                value={formData.transliteration_segments_json || ""}
                onChange={(e) =>
                  handleChange("transliteration_segments_json", e.target.value)
                }
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                placeholder='[{"text": "Alhamdulillah", "start_time": 0.0, "end_time": 1.5}, ...]'
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium text-sm">
                Translation Segments JSON
              </span>
              <textarea
                rows="3"
                disabled={!hasCategories || isLoading}
                value={formData.translation_segments_json || ""}
                onChange={(e) =>
                  handleChange("translation_segments_json", e.target.value)
                }
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                placeholder='[{"text": "All praise is for Allah", "start_time": 0.0, "end_time": 1.5}, ...]'
              />
            </label>

            <h5 className="text-sm font-bold text-blue-800 border-b border-blue-200 pb-2 pt-4">
              Metadata and Context
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  disabled={!hasCategories || isLoading}
                  value={formData.source || ""}
                  onChange={(e) => handleChange("source", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                  placeholder="HR. at-Tirmidzi: 2879"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notes (e.g., Count)
                </label>
                <input
                  type="text"
                  disabled={!hasCategories || isLoading}
                  value={formData.notes || ""}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                  placeholder="Read 1x after Fajr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Benefits / Virtue
              </label>
              <textarea
                rows="1"
                disabled={!hasCategories || isLoading}
                value={formData.benefits || ""}
                onChange={(e) => handleChange("benefits", e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:bg-gray-200"
                placeholder="Protects until the evening."
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
          Mark as **Featured** Dua/Adhkar
        </label>
      </div>
    </div>
  );
};

export default ManualEntryTab;
export { CategorySelectComponent };
