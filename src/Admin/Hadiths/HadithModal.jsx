import React, { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import HadithManualEntryTab from "./HadithManulaEntryTap";
import HadithBulkDataUploadTab from "./HadithBulkDataUpload";
import CreateCategoryModal from "../CreateCategoryModal";
import {
  createOrUpdateHadith,
  bulkUploadHadith,
  API_BASE, 
} from "../apiService";

const GRADIENT_CLASS = "bg-gradient-to-r from-emerald-600 to-teal-700";
const HOVER_GRADIENT_CLASS = "hover:opacity-90 transition-opacity";

const HadithModal = ({
  show,
  onClose,
  onSave,
  title,
  isEdit = false,
  categories = [],
  formData: initialFormData,
  fetchCategories,
}) => {
  const INITIAL_HADITH_STATE = {
    title: "",
    arabic: "",
    translation: "",
    narrator: "",
    source: "",
    reference: "",
    category: "",
    featured: false,
  };

  const [formData, setFormData] = useState(INITIAL_HADITH_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tab, setTab] = useState("manual");
  const [bulkDataFile, setBulkDataFile] = useState(null);
  const [bulkDataCategoryId, setBulkDataCategoryId] = useState("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [categoryUpdatedKey, setCategoryUpdatedKey] = useState(0);

  const currentCategories = categories.filter((c) => c.id !== "all");
  const hasCategories = currentCategories.length > 0;

  useEffect(() => {
    if (show) {
      const defaultCategory = currentCategories[0]?.id || "";
      setFormData({
        ...INITIAL_HADITH_STATE,
        ...initialFormData,
        category:
          String(initialFormData?.category_id || initialFormData?.category) ||
          defaultCategory,
      });
      setBulkDataCategoryId(defaultCategory);
      setTab(isEdit ? "manual" : "manual");
      setBulkDataFile(null);
      setError(null);
      setShowAdditional(
        isEdit &&
          (initialFormData?.narrator ||
            initialFormData?.source ||
            initialFormData?.reference ||
            initialFormData?.featured)
      );
    }
  }, [show, isEdit, initialFormData, categories.length, categoryUpdatedKey]);

  if (!show) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryCreated = () => {
    setShowCategoryModal(false);
    setCategoryUpdatedKey((prev) => prev + 1);
    if (fetchCategories) fetchCategories();
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!hasCategories) {
      setError("Please create at least one category before adding a Hadith.");
      setIsLoading(false);
      return;
    }

    const hadithData = {
      ...formData,
      category_id: parseInt(formData.category) || null,
      category: undefined,
    };

    try {
      await createOrUpdateHadith(hadithData, isEdit, initialFormData?.id);
      onSave();
      onClose();
    } catch (err) {
      console.error("Hadith operation error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDataUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!bulkDataFile) {
      setError("Please select a file to upload.");
      setIsLoading(false);
      return;
    }

    if (!bulkDataCategoryId) {
      setError("Please select a category before uploading.");
      setIsLoading(false);
      return;
    }

    try {
      const responseData = await bulkUploadHadith(
        bulkDataFile,
        bulkDataCategoryId
      );

      const newIds = responseData.inserted_ids;
      onSave(newIds);
      onClose();
    } catch (err) {
      console.error("Bulk upload error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "manual") return handleManualSubmit(e);
    if (tab === "file") return handleBulkDataUpload(e);
  };

  const getSubmitButtonText = () => {
    if (isLoading) return "Saving...";
    if (tab === "manual") return isEdit ? "Save Changes" : "Add Hadith";
    return "Upload Data";
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-emerald-100 flex flex-col">
          <div
            className={`sticky top-0 p-4 flex items-center justify-between rounded-t-xl shadow-md z-10 ${GRADIENT_CLASS}`}
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex space-x-2">
              {[
                { key: "manual", label: "Manual Entry" },
                { key: "file", label: "Bulk Data Upload" },
              ]
                .filter((t) => (isEdit ? t.key === "manual" : true))
                .map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                      tab === t.key
                        ? "bg-emerald-100 text-emerald-800 shadow-inner"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={isLoading}
                  >
                    {t.label}
                  </button>
                ))}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-4 flex-grow overflow-y-auto space-y-4"
          >
            {error && (
              <div
                className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium"
                role="alert"
              >
                Error: {error}
              </div>
            )}
            {tab === "manual" && (
              <HadithManualEntryTab
                formData={formData}
                handleChange={handleChange}
                currentCategories={currentCategories}
                hasCategories={hasCategories}
                isLoading={isLoading}
                setShowCategoryModal={setShowCategoryModal}
                showAdditional={showAdditional}
                setShowAdditional={setShowAdditional}
              />
            )}
            {tab === "file" && !isEdit && (
              <HadithBulkDataUploadTab
                currentCategories={currentCategories}
                hasCategories={hasCategories}
                isLoading={isLoading}
                bulkDataCategoryId={bulkDataCategoryId}
                setBulkDataCategoryId={setBulkDataCategoryId}
                bulkDataFile={bulkDataFile}
                setBulkDataFile={setBulkDataFile}
                setShowCategoryModal={setShowCategoryModal}
              />
            )}
            <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !hasCategories}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-md ${
                  !hasCategories || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : `${GRADIENT_CLASS} ${HOVER_GRADIENT_CLASS}`
                }`}
              >
                {isLoading ? <div className="w-4 h-4 loader" /> : null}
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
      <CreateCategoryModal
        show={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleCategoryCreated}
        API_BASE={API_BASE}
        categories={categories}
        fetchCategories={fetchCategories}
      />
    </>
  );
};

export default HadithModal;
