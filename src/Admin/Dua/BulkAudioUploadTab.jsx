import React, { useState, useEffect } from "react";
import { Volume2, Upload, FileAudio } from "lucide-react";
import { CategorySelectComponent } from "./ManualEntryTab";

const BulkAudioUploadTab = ({
  currentCategories,
  hasCategories,
  isLoading,
  audioCategoryId,
  setAudioCategoryId,
  bulkAudioFiles,
  setBulkAudioFiles,
  audioMapping,
  setAudioMapping,
  setShowCategoryModal,
}) => {
  const [fileIdMap, setFileIdMap] = useState({});

  useEffect(() => {
    const newFileIdMap = {};
    const currentFilenames = bulkAudioFiles.map((file) => file.name);

    currentFilenames.forEach((name) => {
      newFileIdMap[name] = fileIdMap[name] || "";
    });

    setFileIdMap(newFileIdMap);

    const finalMapping = currentFilenames
      .map((name) => {
        const dua_id = parseInt(newFileIdMap[name]);
        if (dua_id && !isNaN(dua_id)) {
          return { dua_id: dua_id, filename: name };
        }
        return null;
      })
      .filter((item) => item !== null);

    setAudioMapping(finalMapping);
  }, [bulkAudioFiles]);

  const handleIdChange = (filename, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    setFileIdMap((prev) => {
      const updatedMap = { ...prev, [filename]: numericValue };

      const finalMapping = bulkAudioFiles
        .map((file) => {
          const name = file.name;
          const dua_id = parseInt(updatedMap[name]);
          if (dua_id && !isNaN(dua_id)) {
            return { dua_id: dua_id, filename: name };
          }
          return null;
        })
        .filter((item) => item !== null);

      setAudioMapping(finalMapping);
      return updatedMap;
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
        <h4 className="flex items-center gap-2 text-base font-bold text-purple-800">
          <Volume2 className="w-4 h-4" /> Bulk Audio Update
        </h4>
        <p className="text-xs text-purple-700">
          Upload multiple audio files. You must manually **map each file to its
          correct Dua ID** below.
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
          htmlFor="bulk_audio_files"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Select Audio Files (MP3, WAV, etc.)
        </label>
        <input
          type="file"
          id="bulk_audio_files"
          accept="audio/*"
          multiple
          onChange={(e) => setBulkAudioFiles(Array.from(e.target.files))}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
          disabled={isLoading}
        />
      </div>

      {bulkAudioFiles.length > 0 && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-3">
          <h5 className="font-bold text-gray-800 flex items-center gap-2">
            <FileAudio className="w-4 h-4 text-emerald-600" /> Map{" "}
            {bulkAudioFiles.length} Uploaded Files to Dua IDs
          </h5>
          <p className="text-xs text-gray-500">
            You must enter the unique Dua ID for each file. Only mapped files
            will be included in the upload.
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bulkAudioFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-md"
              >
                <span className="flex-1 text-xs font-medium text-gray-700 truncate">
                  {file.name}
                </span>
                <div className="w-24 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Dua ID"
                    value={fileIdMap[file.name] || ""}
                    onChange={(e) => handleIdChange(file.name, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
            ))}
          </div>
          {audioMapping.length > 0 && (
            <p
              className={`mt-2 text-sm font-medium ${
                audioMapping.length === bulkAudioFiles.length
                  ? "text-green-600"
                  : "text-orange-600"
              }`}
            >
              {audioMapping.length} of {bulkAudioFiles.length} files
              successfully mapped to a Dua ID.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkAudioUploadTab;
