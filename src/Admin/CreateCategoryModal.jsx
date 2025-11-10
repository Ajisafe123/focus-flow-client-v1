import React, { useState, useCallback } from "react";
import {
  X,
  Tag,
  ListPlus,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Check,
} from "lucide-react";

import DeleteConfirmModal from "./DeleteConfirmModal";

const GRADIENT_CLASS = "bg-gradient-to-r from-emerald-600 to-green-700";
const HOVER_GRADIENT_CLASS = "hover:from-emerald-700 hover:to-green-800";
const API_BASE = "http://localhost:8000";

const CreateCategoryModal = ({
  show,
  onClose,
  onSave,
  categories = [],
  fetchCategories,
  categoryType = "dua",
}) => {
  const INITIAL_FORM_STATE = {
    name: "",
    description: "",
    is_active: true,
    id: null,
  };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isEditing = formData.id !== null;

  const getApiPath = useCallback(
    (id = null) => {
      let basePath;
      if (categoryType === "hadith") {
        basePath = `${API_BASE}/api/hadith-categories`;
      } else {
        basePath = `${API_BASE}/api/dua-categories`;
      }
      return id ? `${basePath}/${id}` : basePath;
    },
    [categoryType]
  );

  if (!show) return null;

  const manageableCategories = categories.filter((c) => c.id !== "all");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const method = isEditing ? "PATCH" : "POST";
    const url = getApiPath(isEditing ? formData.id : null);

    const payload = {
      name: formData.name,
      description: formData.description,
      is_active: formData.is_active,
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage =
          res.statusText ||
          `Failed to ${isEditing ? "update" : "create"} category.`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const responseData = await res.json();

      setFormData(INITIAL_FORM_STATE);

      if (typeof fetchCategories === "function") {
        await fetchCategories({
          updatedData: responseData,
          action: isEditing ? "UPDATE" : "CREATE",
        });
      }

      onSave();
    } catch (err) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} Category:`,
        err.message
      );
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategoryForEdit = (category) => {
    setError(null);
    setFormData({
      id: category.id,
      name: category.label || category.name,
      description: category.description || "",
      is_active: category.is_active ?? true,
    });
  };

  const confirmDelete = (category) => {
    setDeleteTarget(category);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    setShowDeleteConfirm(false);

    const categoryId = deleteTarget.id;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(getApiPath(categoryId), {
        method: "DELETE",
      });

      if (!res.ok) {
        let errorMessage = res.statusText || "Failed to delete category.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      if (formData.id === categoryId) {
        setFormData(INITIAL_FORM_STATE);
      }

      if (typeof fetchCategories === "function") {
        await fetchCategories({ deletedId: categoryId, action: "DELETE" });
      }

      onSave();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting category:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
        <div
          className={`${GRADIENT_CLASS} p-5 flex items-center justify-between rounded-t-2xl shadow-lg flex-shrink-0`}
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ListPlus className="w-6 h-6" />
            {isEditing
              ? `Edit ${
                  categoryType.charAt(0).toUpperCase() + categoryType.slice(1)
                } Category`
              : `Create New ${
                  categoryType.charAt(0).toUpperCase() + categoryType.slice(1)
                } Category`}
          </h2>
          <button
            onClick={onClose}
            className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-6">
            {error && (
              <div
                className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                role="alert"
              >
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-700" /> Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isEditing
                      ? "border-amber-400 focus:ring-amber-500 bg-amber-50"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
                  placeholder="e.g., Daily Duas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    isEditing
                      ? "border-amber-400 focus:ring-amber-500 bg-amber-50"
                      : "border-gray-300 focus:ring-emerald-500"
                  }`}
                  placeholder="Duas and Adhkar recommended for daily recitation."
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded-sm focus:ring-green-500 border-gray-300"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Is Active (Show in lists)
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-3 border-t border-gray-200">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setFormData(INITIAL_FORM_STATE)}
                  disabled={isLoading}
                  className="flex-1 px-5 py-2 border border-amber-400 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-medium disabled:opacity-50"
                >
                  <span className="font-bold">Exit Edit Mode</span>
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-2 ${GRADIENT_CLASS} text-white rounded-lg ${HOVER_GRADIENT_CLASS} transition-all duration-200 font-semibold shadow-md disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}{" "}
                    {isEditing ? "Update Category" : "Save Category"}
                  </>
                )}
              </button>
            </div>
          </form>

          <hr className="my-4 mx-6 border-gray-200" />

          <div className="px-6 pb-6 pt-2">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Existing Categories ({manageableCategories.length})
            </h3>

            <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-2">
              {manageableCategories.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No categories created yet (besides "All Categories").
                </p>
              ) : (
                manageableCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-lg border transition-all flex flex-col ${
                      formData.id === cat.id
                        ? "bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0 flex items-center gap-2">
                        <Tag
                          className={`w-4 h-4 flex-shrink-0 mt-1 ${
                            cat.is_active ? "text-emerald-600" : "text-gray-400"
                          }`}
                        />
                        <p
                          className={`font-semibold text-base truncate ${
                            cat.is_active
                              ? "text-gray-900"
                              : "text-gray-500 line-through"
                          }`}
                        >
                          {cat.label}{" "}
                          <span className="font-mono text-xs text-gray-500">
                            (ID: {cat.id})
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => loadCategoryForEdit(cat)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isEditing && formData.id === cat.id
                              ? "text-white bg-amber-500"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title="Edit Category"
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(cat)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 pl-6 mt-1 truncate">
                      {cat.description || "— No description —"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50`}
          >
            Close Management
          </button>
        </div>
      </div>

      <DeleteConfirmModal
        show={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTarget(null);
        }}
        onDelete={executeDelete}
        itemType={`${
          categoryType.charAt(0).toUpperCase() + categoryType.slice(1)
        } Category`}
        itemTitle={deleteTarget?.label || "this category"}
      />
    </div>
  );
};

export default CreateCategoryModal;
