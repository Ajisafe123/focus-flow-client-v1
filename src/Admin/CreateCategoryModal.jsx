import React, { useState, useRef } from "react";
import {
  X,
  Tag,
  ListPlus,
  Plus,
  Edit,
  Trash2,
  Check,
  ImageIcon,
} from "lucide-react";

import DeleteConfirmModal from "./DeleteModal";
import apiService, { API_BASE_URL as API_BASE } from "../Components/Service/apiService";

const GRADIENT_CLASS = "bg-gradient-to-r from-emerald-600 to-green-700";
const HOVER_GRADIENT_CLASS = "hover:from-emerald-700 hover:to-green-800";

const getFullImageUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;

  let path = relativePath.trim();
  if (!path.startsWith("/static/")) {
    path = `/static/category_images/${path}`;
  }
  if (path.startsWith("//")) path = path.replace(/^\/+/, "/");

  return `${API_BASE}${path}`;
};

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
    image_url: null,
    is_active: true,
    id: null,
  };

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const isEditing = formData.id !== null;

  if (!show) return null;

  const manageableCategories = categories.filter((c) => c.id !== "all");

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(getFullImageUrl(formData.image_url));
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let updatedCategory;

      if (isEditing) {
        updatedCategory = await apiService.updateCategory(categoryType, formData.id, {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
        });

        if (imageFile) {
          updatedCategory = await apiService.uploadCategoryImage(
            categoryType,
            formData.id,
            imageFile
          );
        }
      } else {
        updatedCategory = await apiService.createCategory(
          categoryType,
          formData,
          imageFile
        );
      }

      setFormData(INITIAL_FORM_STATE);
      setImageFile(null);
      setImagePreview(null);

      if (typeof fetchCategories === "function") {
        await fetchCategories({
          updatedData: updatedCategory,
          action: isEditing ? "UPDATE" : "CREATE",
        });
      }

      onSave();
    } catch (err) {
      setError(err.message || "Something went wrong");
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
      image_url: category.image_url || null,
      is_active: category.is_active ?? true,
    });
    setImageFile(null);
    setImagePreview(getFullImageUrl(category.image_url));
  };

  const confirmDelete = (category) => {
    setDeleteTarget(category);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;

    setIsLoading(true);
    setError(null);

    try {
      await apiService.deleteCategory(categoryType, deleteTarget.id);

      if (formData.id === deleteTarget.id) {
        setFormData(INITIAL_FORM_STATE);
        setImageFile(null);
        setImagePreview(null);
      }

      if (typeof fetchCategories === "function") {
        await fetchCategories({ deletedId: deleteTarget.id, action: "DELETE" });
      }

      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const currentImageUrl = imagePreview || getFullImageUrl(formData.image_url);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-700" /> Category
                  Image (Optional)
                </label>
                <div
                  className={`border rounded-lg p-3 transition-colors flex items-center gap-4 ${
                    isEditing
                      ? "border-amber-400 focus-within:ring-amber-500 bg-amber-50"
                      : "border-gray-300 focus-within:ring-emerald-500"
                  }`}
                >
                  {currentImageUrl && (
                    <div className="flex-shrink-0 relative">
                      <img
                        src={currentImageUrl}
                        alt="Category Preview"
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        onError={(e) => {}}
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-md"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={imageInputRef}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
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
                  onClick={() => {
                    setFormData(INITIAL_FORM_STATE);
                    setImageFile(null);
                    setImagePreview(null);
                  }}
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
                    <div className="w-5 h-5 loader" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
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
                manageableCategories.map((cat) => {
                  const imageUrl = getFullImageUrl(cat.image_url);
                  const isImageAvailable = !!imageUrl;

                  return (
                    <div
                      key={cat.id}
                      className={`p-3 rounded-lg border transition-all flex flex-col ${
                        formData.id === cat.id
                          ? "bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-200"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0 flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex-shrink-0 border flex items-center justify-center overflow-hidden ${
                              cat.is_active
                                ? "border-emerald-600"
                                : "border-gray-400"
                            } ${isImageAvailable ? "bg-white" : "bg-gray-200"}`}
                          >
                            <img
                              src={imageUrl}
                              alt={cat.label || "Category image"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.opacity = "0";
                              }}
                            />
                          </div>

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

                      <p className="text-xs text-gray-600 pl-9 mt-1 truncate">
                        {cat.description || "— No description —"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Close Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
