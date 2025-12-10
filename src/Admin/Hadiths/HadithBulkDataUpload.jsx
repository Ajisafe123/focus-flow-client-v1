import React from "react";
import { FileText, Tag, ListPlus } from "lucide-react";

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

const HadithBulkDataUploadTab = ({
  currentCategories,
  hasCategories,
  isLoading,
  bulkDataCategoryId,
  setBulkDataCategoryId,
  bulkDataFile,
  setBulkDataFile,
  setShowCategoryModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
        <h4 className="flex items-center gap-2 text-base font-bold text-blue-800">
          <FileText className="w-4 h-4" /> Bulk Hadith Data Upload (CSV / JSON)
        </h4>
        <p className="text-xs text-blue-700">
          Upload multiple Hadiths using a structured CSV or JSON file. Ensure
          mandatory fields like `title`, `translation`, and `category_id` are
          present.
        </p>
      </div>
      <CategorySelectComponent
        value={bulkDataCategoryId}
        onChange={(e) => setBulkDataCategoryId(e.target.value)}
        label="Target Category for Uploaded Hadiths"
        currentCategories={currentCategories}
        hasCategories={hasCategories}
        isLoading={isLoading}
        setShowCategoryModal={setShowCategoryModal}
      />
      <div>
        <label
          htmlFor="bulk_data_file"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Select Data File
        </label>
        <input
          type="file"
          id="bulk_data_file"
          accept=".csv, application/json"
          onChange={(e) => setBulkDataFile(e.target.files[0])}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
          required
          disabled={isLoading}
        />
        {bulkDataFile && (
          <p className="mt-2 text-xs text-gray-600">
            File selected: **{bulkDataFile.name}**
          </p>
        )}
      </div>
    </div>
  );
};

export default HadithBulkDataUploadTab;
