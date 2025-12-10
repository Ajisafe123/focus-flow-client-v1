import React, { useState, useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import CreateCategoryModal from "../CreateCategoryModal";
import ManualEntryTab from "./ManualEntryTab";
import BulkDataUploadTab from "./BulkDataUploadTab";
import BulkAudioUploadTab from "./BulkAudioUploadTab";
import {
  createOrUpdateDua,
  bulkUploadDuaData,
  bulkUploadDuaAudio,
  API_BASE,
} from "../apiService";

const GRADIENT_CLASS = "bg-gradient-to-r from-emerald-600 to-teal-700";
const HOVER_GRADIENT_CLASS = "hover:opacity-90 transition-opacity";

const DuaModal = ({
  show,
  onClose,
  onSave,
  title,
  isEdit = false,
  categories,
  formData: initialFormData,
  fetchCategories,
}) => {
  const INITIAL_DUA_STATE = {
    title: "",
    arabic: "",
    transliteration: "",
    translation: "",
    notes: "",
    benefits: "",
    source: "",
    category: "",
    featured: false,
    arabic_segments_json: "",
    transliteration_segments_json: "",
    translation_segments_json: "",
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

  const segmentObjectToString = (data) => {
    if (!data) return "";
    if (typeof data === "string") return data;
    if (Array.isArray(data) || typeof data === "object") {
      try {
        return JSON.stringify(data, null, 2);
      } catch {
        return "";
      }
    }
    return "";
  };

  useEffect(() => {
    if (show) {
      const defaultCategory = currentCategories[0]?.id || "";
      setFormData({
        ...INITIAL_DUA_STATE,
        ...initialFormData,
        transliteration:
          initialFormData?.transliteration || initialFormData?.latin || "",
        category:
          String(
            initialFormData?.category_id || initialFormData?.category || ""
          ) || defaultCategory,
        arabic_segments_json: segmentObjectToString(
          initialFormData?.arabic_segments_json
        ),
        transliteration_segments_json: segmentObjectToString(
          initialFormData?.transliteration_segments_json
        ),
        translation_segments_json: segmentObjectToString(
          initialFormData?.translation_segments_json
        ),
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
            initialFormData?.featured ||
            initialFormData?.arabic_segments_json ||
            initialFormData?.transliteration_segments_json ||
            initialFormData?.translation_segments_json)
      );
    }
  }, [show, isEdit, initialFormData, categories.length, categoryUpdatedKey]);

  if (!show) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryCreated = () => {
    setShowCategoryModal(false);
    fetchCategories();
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
      transliteration: formData.transliteration || "",
      category: undefined,
    };

    const segmentFields = [
      "arabic_segments_json",
      "transliteration_segments_json",
      "translation_segments_json",
    ];
    for (const field of segmentFields) {
      if (duaData[field]) {
        try {
          if (
            typeof duaData[field] === "string" &&
            duaData[field].trim() !== ""
          ) {
            JSON.parse(duaData[field]);
          } else {
            duaData[field] = null;
          }
        } catch {
          setError(
            `Invalid JSON format in ${field
              .replace("_json", "")
              .replace("_", " ")} field.`
          );
          setIsLoading(false);
          return;
        }
      }
    }

    try {
      await createOrUpdateDua(duaData, isEdit, initialFormData?.id);

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

    try {
      const responseData = await bulkUploadDuaData(
        bulkDataFile,
        audioCategoryId
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

    try {
      await bulkUploadDuaAudio(audioFileToUpload, audioCategoryId);

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
              type="button"
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
                    type="button"
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
                categorySelectClass="text-gray-900"
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
                categorySelectClass="text-gray-900"
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
                // FIX: Add text-gray-900 class to category select
                categorySelectClass="text-gray-900"
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
                disabled={isLoading || (tab !== "audio" && !hasCategories)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded-lg font-medium shadow-md ${
                  (tab !== "audio" && !hasCategories) || isLoading
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

export default DuaModal;
