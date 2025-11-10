import React from "react";
import { FileText } from "lucide-react";
import { CategorySelectComponent } from "./ManualEntryTab"; 

const BulkDataUploadTab = ({
  currentCategories,
  hasCategories,
  isLoading,
  audioCategoryId,
  setAudioCategoryId,
  bulkDataFile,
  setBulkDataFile,
  setShowCategoryModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
        <h4 className="flex items-center gap-2 text-base font-bold text-blue-800">
          <FileText className="w-4 h-4" /> Bulk Data Upload (CSV / JSON)
        </h4>
        <p className="text-xs text-blue-700">
          Upload multiple Duas using a structured <b>CSV</b> or <b>JSON</b>{" "}
          file. Ensure fields like <code>title</code>, <code>arabic</code>, and
          <code>category_id</code> are present.
        </p>
      </div>

      <CategorySelectComponent
        value={audioCategoryId}
        onChange={(e) => setAudioCategoryId(e.target.value)}
        label="Target Category"
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
            File selected: <b>{bulkDataFile.name}</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default BulkDataUploadTab;
