import React, { useState, useEffect } from "react";
import { X, BookOpen, Loader2, ListPlus, ChevronDown } from "lucide-react";
import CreateCategoryModal from "../CreateCategoryModal";
import ManualEntryTab from "./ManualEntryTab";
import BulkDataUploadTab from "./BulkDataUploadTab";
import BulkAudioUploadTab from "./BulkAudioUploadTab";

const GRADIENT_CLASS = "bg-gradient-to-r from-emerald-600 to-teal-700";
const HOVER_GRADIENT_CLASS = "hover:opacity-90 transition-opacity";

const DuaAdhkarModal = ({
  show,
  onClose,
  onSave,
  title,
  isEdit = false,
  categories,
  formData: initialFormData,
  API_BASE = "http://localhost:8000",
  fetchCategories,
}) => {
  const INITIAL_DUA_STATE = {
    title: "",
    arabic: "",
    translitration: "",
    translation: "",
    notes: "",
    benefits: "",
    source: "",
    category: "",
    featured: false,
  };

  const [formData, setFormData] = useState(INITIAL_DUA_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tab, setTab] = useState("manual");
  const [bulkDataFile, setBulkDataFile] = useState(null);
  const [bulkAudioFiles, setBulkAudioFiles] = useState([]);
  const [audioMapping, setAudioMapping] = useState([]);
  const [audioCategoryId, setAudioCategoryId] = useState("");
  const [showAdditional, setShowAdditional] = useState(false);
  const [categoryUpdatedKey, setCategoryUpdatedKey] = useState(0);

  const currentCategories = categories.filter((c) => c.id !== "all");
  const hasCategories = currentCategories.length > 0;

  useEffect(() => {
    if (show) {
      const defaultCategory = currentCategories[0]?.id || "";
      setFormData({
        ...INITIAL_DUA_STATE,
        ...initialFormData,
        translitration:
          initialFormData?.translitration || initialFormData?.latin || "",
        category:
          String(initialFormData?.category_id || initialFormData?.category) ||
          defaultCategory,
      });
      setAudioCategoryId(defaultCategory);
      setTab(isEdit ? "manual" : "manual");
      setBulkDataFile(null);
      setBulkAudioFiles([]);
      setAudioMapping([]);
      setError(null);
      setShowAdditional(
        isEdit &&
          (initialFormData?.notes ||
            initialFormData?.benefits ||
            initialFormData?.source ||
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
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!hasCategories) {
      setError("Please create at least one category before adding a Dua.");
      setIsLoading(false);
      return;
    }

    const duaData = {
      ...formData,
      category_id: parseInt(formData.category) || null,
      translitration: formData.translitration || "",
      category: undefined,
    };

    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit
      ? `${API_BASE}/api/duas/${initialFormData.id}`
      : `${API_BASE}/api/duas`;

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duaData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail || errorData.message || res.statusText
        );
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Dua operation error:", err.message);
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

    if (!audioCategoryId) {
      setError("Please select a category before uploading.");
      setIsLoading(false);
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append("file", bulkDataFile);
    fileFormData.append("category_id", audioCategoryId);

    try {
      const res = await fetch(`${API_BASE}/api/duas/bulk-data-upload`, {
        method: "POST",
        body: fileFormData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `Bulk upload failed: ${res.statusText}`
        );
      }

      const responseData = await res.json();
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

  const handleBulkAudioUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!bulkAudioFiles.length || !audioCategoryId) {
      setError("Please select a category and at least one audio file.");
      setIsLoading(false);
      return;
    }

    const audioFileToUpload = bulkAudioFiles[0];
    if (!audioFileToUpload) {
      setError("Audio file not found or selected incorrectly.");
      setIsLoading(false);
      return;
    }

    const audioFormData = new FormData();
    audioFormData.append(
      "audio_file",
      audioFileToUpload,
      audioFileToUpload.name
    );

    try {
      const url = `${API_BASE}/api/categories/${audioCategoryId}/audio-update`;

      const res = await fetch(url, {
        method: "POST",
        body: audioFormData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errorMessage =
          errorData.detail?.message ||
          errorData.detail ||
          `Bulk audio upload failed: ${res.statusText}`;
        if (typeof errorData.detail === "object" && errorData.detail.errors) {
          errorMessage =
            errorData.detail.message +
            ": " +
            errorData.detail.errors.join(", ");
        }
        throw new Error(errorMessage);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Bulk audio upload error:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "manual") return handleManualSubmit(e);
    if (tab === "file") return handleBulkDataUpload(e);
    if (tab === "audio") return handleBulkAudioUpload(e);
  };

  const getSubmitButtonText = () => {
    if (isLoading) return "Saving...";
    if (tab === "manual") return isEdit ? "Save Changes" : "Add Dua/Adhkar";
    return tab === "file" ? "Upload Data" : "Upload Audio";
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
              className="p-1 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex space-x-2">
              {[
                { key: "manual", label: "Manual Entry" },
                { key: "file", label: "Bulk Data Upload" },
                { key: "audio", label: "Bulk Audio Update" },
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
              <ManualEntryTab
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
              <BulkDataUploadTab
                currentCategories={currentCategories}
                hasCategories={hasCategories}
                isLoading={isLoading}
                audioCategoryId={audioCategoryId}
                setAudioCategoryId={setAudioCategoryId}
                bulkDataFile={bulkDataFile}
                setBulkDataFile={setBulkDataFile}
                setShowCategoryModal={setShowCategoryModal}
              />
            )}
            {tab === "audio" && !isEdit && (
              <BulkAudioUploadTab
                currentCategories={currentCategories}
                hasCategories={hasCategories}
                isLoading={isLoading}
                audioCategoryId={audioCategoryId}
                setAudioCategoryId={setAudioCategoryId}
                bulkAudioFiles={bulkAudioFiles}
                setBulkAudioFiles={setBulkAudioFiles}
                audioMapping={audioMapping}
                setAudioMapping={setAudioMapping}
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
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
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

export default DuaAdhkarModal;
